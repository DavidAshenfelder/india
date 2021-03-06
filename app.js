var $username = 'Guest';

$(document).ready(function(){
  page.init();
});


var page = {

  url: 'http://tiy-fee-rest.herokuapp.com/collections/muffnpuff',
  urlCart: "http://tiy-fee-rest.herokuapp.com/collections/" + $username,
  urlReviews: 'http://tiy-fee-rest.herokuapp.com/collections/reviews',
  urlProfile: 'http://tiy-fee-rest.herokuapp.com/collections/muffnpuffprofile',

  init: function() {
    page.initStyling();
    page.initEvents();
  },


  initStyling: function() {
    $('#usernameBlock').text($username);
    page.createCatalog();
    page.refreshCart();
  },


  initEvents: function(event) {

  //NAVIGATION BETWEEN PAGES
    $('#headerRight').on('click', '#cartBlock', function(e) {
      e.preventDefault();
      $('#productPage').removeClass('activePage');
      $('#catalogPage').removeClass('activePage');
      $('#cartPage').addClass('activePage');
    });
    $('#headerLeftLogo img').on('click', function(e){
      e.preventDefault();
      $('#productPage').removeClass('activePage');
      $('#cartPage').removeClass('activePage');
      $('#catalogPage').addClass('activePage');
    });
    $('#catalogPage').on('click', '.catalogProductBlock', function(e){
      e.preventDefault();
      $('#cartPage').removeClass('activePage');
      $('#catalogPage').removeClass('activePage');
      $('#productPage').addClass('activePage');
    });
  /////////////////////////
  ///Login Form Submission button////////
  $('#loginFormWrapper').on('click', '#createAcctSubmit', function(e) {
      e.preventDefault();
      page.postProfile()

  });
  ///////////////////////////////////////

  $('body').on('click', '#productAddToWishListButton', function(event) {
    event.preventDefault();
    page.loadProfile();
    $('#profilePageWrapper').addClass('activePage')
  })

  $('body').on('click', '#productAddWishList', function(event){
    event.preventDefault();
    console.log(this);
    var productData;
    var titleEquals = $(this).closest('#productPage').find("#productPageTitle h2").text();
    console.log("titleEquals:", titleEquals);
    _.each(products, function(el,idx,arr) {
      if (el.productTitle === titleEquals) {
        productData = el;
      }
    });
    console.log(productData);
    page.loadTemplate("wishListItem", productData, $("#wishList"))

  })

      $('#headerRight').on('click', '#logInSubmitButton', function(event) {
      event.preventDefault();
      var $username = $('input[id="logInUsername"]').val()
      var loadId =
      $('#usernameBox').append($username)
      $('input[id="logInUsername"]').val('')
      $('#logInForm').hide()
      $('#usernameBox').addClass('activePage')
      })

    $('#catalogPageContent').on('click', '.catalogProductBlock', function(e) {
      var newProduct = page.getProductFromCatalog(this);
      $('#productPage').html("");
      page.loadTemplate('productPage', newProduct, $('#productPage'));
      $("html, body").animate({ scrollTop: 270 }, "slow");
      _.each(products, function(el,idx,arr) {
        if (newProduct.pairing === el.productTitle) {
          $('#productPagePairingImage').html(el.productThumb);
          $('#productPagePairingImage').attr('data', el.productTitle);
        }
      });
      page.refreshReviews();
    });

    $('#productPage').on('click', '#productPagePairingImage img', function(e) {
      var pairingTitle = $(this).closest('#productPagePairingImage').attr('data');
      var newProduct;
      _.each(products, function(el,idx,arr) {
        if (pairingTitle === el.productTitle) {
          newProduct = el;
        }
      });
      $('#productPage').html("");
      page.loadTemplate('productPage', newProduct, $('#productPage'));

      _.each(products, function(el,idx,arr) {
        if (newProduct.pairing === el.productTitle) {
          $('#productPagePairingImage').html(el.productThumb);
          $('#productPagePairingImage').attr('data', el.productTitle);
        }
      });
      page.refreshReviews();
    });

    $('#productPage').on('click', '#productAddToCartButton', function(e) {
      e.preventDefault();
      $('#cartPlusOne').fadeIn().removeClass('productAddedStarting').addClass('productAddedAnimate');
      setTimeout(function(){
        $('#cartPlusOne').removeClass('productAddedAnimate').addClass('productAddedStarting');
      }, 500);
      var newProduct = page.getProductFromProductPage(this);
      console.log(newProduct);
      $.ajax({
        url: page.urlCart,
        method: 'POST',
        data: newProduct,
        success: function (data) {
          page.refreshCart(data);
        },
        error: function (err) {
          console.log("error ", err);
        }
      });

      $('#cartCheckOutButton').on('click', function(e) {
       e.preventDefault();
       alert("You have checkout out! Thank you for your order!")
     })
    });

    $('#pageWrapper').on('click', '.catalogAddToCartButton', function(e) {
      e.preventDefault();
      $('#cartPlusOne').fadeIn().removeClass('productAddedStarting').addClass('productAddedAnimate');
      setTimeout(function(){
        $('#cartPlusOne').removeClass('productAddedAnimate').addClass('productAddedStarting');
      }, 1000);
      var newProduct = page.getProductFromCatalogAddCart(this);
      console.log(newProduct);
      $.ajax({
        url: page.urlCart,
        method: 'POST',
        data: newProduct,
        success: function (data) {
          page.refreshCart(data);
        },
        error: function (err) {
          console.log("error ", err);
        }
      });
    });

    $('#cartItemsBlock').on('click', '.cartItemDelete', function(e){
      var deleteId = $(this).closest('.cartItem').data('id');
      console.log(deleteId);
      page.deleteItem(deleteId);
    });


    $('body').on('click','#productContinueShoppingButton', function(e) {
      $('#cartPage').removeClass('activePage');
      $('#productPage').removeClass('activePage');
      $('#catalogPage').addClass('activePage');
    });

    $('#cartCheckOutButton').on('click', function(e) {
      e.preventDefault();
      alert("You have checked out! Thank you for your order!")
    });

    $('#cartBlock').on('click', function(e) {
      e.preventDefault();
      $('#cartPage').removeClass('activePage');
      $('#productPage').removeClass('activePage');
      $('#catalogPage').addClass('activePage');
    });

    $('#productContinueShoppingButton').on('click', function(e) {
      e.preventDefault();
      $('#cartPage').removeClass('activePage');
      $('productPage').removeClass('activePage');
      $('#catalogPage').addClass('activePage');
    });

    $('#cartContinueShoppingButton').on('click', function(e) {
      e.preventDefault();
      $('#cartPage').removeClass('activePage');
      $('productPage').removeClass('activePage');
      $('#catalogPage').addClass('activePage');
    });

    $('#cartClearButton').on('click', function(e){
      e.preventDefault();
      var cartItemId;
      $('.cartItem').each(function(idx,el,arr){
        cartItemId = $(el).data('id');
        page.deleteItem(cartItemId);
      });
    });


    $('body').on('click', '#catalogMuffinsButton', function(e) {
      e.preventDefault();
      $('#cartPage').removeClass('activePage');
      $('#productPage').removeClass('activePage');
      $('#catalogPage').removeClass('activePage');
      $('#categoryMuffinPage').addClass('activePage');
    });
    //
    // createMuffinCatalog: function() {
    //   _.each(products, function(el, idx, arr) {
    //     if ('category_id' === "Muffins") {
    //     page.loadTemplate('categoryMuffins', products[idx], $('#catalogPageContent'));
    //   }
    //   });
    // },

    $('#productPage').on('submit', '#productReviewsForm', function(e){
      e.preventDefault();
      if ($('#productReviewsFormComment textarea').val().trim().length > 0) {
        var newReview = {
          reviewAuthor: $('#productReviewsFormUsername').text().trim(),
          reviewContent: $('#productReviewsFormComment textarea').val().trim(),
          reviewRating: $('#productReviewsFormRating select').val(),
          reviewProduct: $(this).closest('#productPage').find("#productPageTitle").children().text()
        }
        $('#productReviewsFormComment textarea').val("");
        page.postReview(newReview);
      }
    });

      $('#pageWrapper').on('click', '#cartContinueShoppingButton', function(e){
        e.preventDefault();
        $('#productPage').removeClass('activePage');
        $('#cartPage').removeClass('activePage');
        $('#catalogPage').addClass('activePage');
        $("html, body").animate({ scrollTop: 270 }, "slow");
      });

      $('#pageWrapper').on('click', '#createAcct', function(event){
        event.preventDefault();
        $('#loginFormWrapper').addClass('activePage')
      })

      $('body').on('click', '#createAcctCancel', function(event){
        event.preventDefault();
        $('#loginFormWrapper').removeClass('activePage')
      })

  },


  loadProfile: function(data) {
    $.ajax ({
      url: page.urlProfile,
      method: 'GET',
      data: data,
      success: function(data) {
        console.log(data);
        page.addOneProfileToDOM()
        console.log(loadedProfile);
      },
      error: function(err) {
        console.log("error");
      }
    });
  },

  deleteAllItems: function() {
    $.ajax({
      url: page.urlCart,
      method: 'DELETE',
      success: function (data) {
        page.refreshCart();
      }
    });
  },

  deleteItem: function(deleteId) {
    $.ajax({
      url: page.urlCart + "/" + deleteId,
      method: 'DELETE',
      success: function (data) {
        page.refreshCart();
      }
    });
  },

  refreshCart: function() {
    console.log('Cart refreshed!');
    $.ajax ({
      url: page.urlCart,
      method: 'GET',
      success: function(data) {
        $('#cartItemsBlock').html("");
        _.each(data, function(el,idx,arr) {
          page.loadTemplate('cartItem', data[idx], $('#cartItemsBlock'));
        });
        page.calculateCartTotal(data);
        $('#cartBlockAmount').html(data.length);
      },
      error: function(err) {
        console.log("error");
      }
    });
  },

  getProductFromCatalogAddCart: function(product) {
    var matchedProduct;
    console.log($(product).closest(".catalogWrapper").find(".catalogProductBlockTitle").text());
    _.each(products, function(el,idx,arr) {
      if ($(product).closest(".catalogWrapper").find(".catalogProductBlockTitle").text().trim() === el.productTitle) {
        matchedProduct = el;
      }
    });
    console.log(matchedProduct);
    var newProduct = {
      productTitle: matchedProduct.productTitle,
      productDescription: matchedProduct.productDescription,
      productPrice: matchedProduct.productPrice,
      productImage: matchedProduct.productImage,
      productThumb: matchedProduct.productThumb,
      pairing: matchedProduct.pairing
    }
    return newProduct;
  },

  getProductFromCatalog: function(product) {
    var matchedProduct;
    _.each(products, function(el,idx,arr) {
      if ($(product).find(".catalogProductBlockTitle").text().trim() === el.productTitle) {
        matchedProduct = el;
      }
    });
    var newProduct = {
      productTitle: matchedProduct.productTitle,
      productDescription: matchedProduct.productDescription,
      productPrice: matchedProduct.productPrice,
      productImage: matchedProduct.productImage,
      productThumb: matchedProduct.productThumb,
      pairing: matchedProduct.pairing
    }
    return newProduct;
  },

  getProductFromProductPage: function(product) {
    var matchedProduct;
    _.each(products, function(el,idx,arr) {
      if ($(product).closest("#productPage").find("#productPageTitle").children().text().trim() === el.productTitle) {
        matchedProduct = el;
      }
    });
    var newProduct = {
      productTitle: matchedProduct.productTitle,
      productDescription: matchedProduct.productDescription,
      productPrice: matchedProduct.productPrice,
      productImage: matchedProduct.productImage,
      productThumb: matchedProduct.productThumb,
      pairing: matchedProduct.pairing
    }

    return newProduct;
  },

  addOneProfileToDOM: function(profile) {
    page.loadTemplate("profilePage", profile, $('#profilePageWrapper'));
  },

    postProfile: function(newProfile) {

      var newProfile = {
        username: $('#username').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        streetAddress: $('#streetAdress').val(),
        City: $('#city').val(),
        State: $('#state').val(),
        Zip: $('#zip').val()
      }

      $.ajax({
        url: page.urlProfile,
        method: 'POST',
        data: newProfile,
        success: function(data) {
          page.addOneProfileToDOM(data);
          $('#profilePageWrapper').addClass('activePage')
          $('#profilePage').addClass('activePage')
          $('#loginFormWrapper').removeClass('activePage')

        },
        error: function(err) {
          console.log('Error');
        }
      })
    },



  deleteProfile: function(deleteId) {
    $.ajax({
      url: page.urlCart + "/" + deleteId,
      method: 'DELETE',
      success: function (data) {

      }
    });
  },

  calculateCartTotal: function(products) {
    $("#cartTotalPrice").html("");
    var totalPrice = 0;
    _.each(products, function(el,idx,arr) {
      totalPrice += Number(el.productPrice);
    });
    $('#cartTotalPrice').text("$" + totalPrice);
  },

  createCatalog: function() {
    _.each(products, function(el, idx, arr) {
      page.loadTemplate('catalogBlock', products[idx], $('#catalogPageContent'));
    });
  },

  postReview: function(newReview) {
    $.ajax({
      url: page.urlReviews,
      method: 'POST',
      data: newReview,
      success: function (data) {
        console.log(data);
        page.refreshReviews(data);
      },
      error: function (err) {
        console.log("error ", err);
      }
    });
  },

  refreshReviews: function(reviews) {
    console.log('Refreshing!');
    $.ajax ({
      url: page.urlReviews,
      method: 'GET',
      success: function(data) {
        $('#productReviewsBlock').html("");
        _.each(data, function(el,idx,arr) {
          if (el.reviewProduct === $("#productPageTitle").children().text()) {
            page.loadTemplate('productReview', el, $('#productReviewsBlock'));
          }
        });
        $('#productReviewsFormUsername').text($username);
      },
      error: function(err) {
        console.log("error");
      }
    });
  },

  deleteAllReviews: function() {
    $.ajax({
      url: page.urlReviews,
      method: 'DELETE',
      success: function (data) {
        page.refreshReviews();
      }
    });
  },

  loadTemplate: function (tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));

    $target.append(compiledTmpl(data));
  },

  getTemplate: function(name) {
    return templates[name];
  },

};
