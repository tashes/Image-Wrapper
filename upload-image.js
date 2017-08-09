// Image Upload Library
(function () {
  var ImageUpload = function (ele, message, viewport, result, callback, failure) {
    var main = document.createElement('main');
    main.innerHTML = '<div class="upload-image__main"><div class="upload-image__main_inner">' + message + '</div></div><div class="upload-image__drop"><div class="upload-image__drop_crop"></div><div class="upload-image__drop_actions"><a class="button special">Done</a><a class="button">Cancel</a></div></div><div class="upload-image__done"><img src=""/><a class="button special">Select Another Image</a></div>';
    main.querySelector('.upload-image__main').style.display = "block";
    main.querySelector('.upload-image__drop').style.display = "none";
    main.querySelector('.upload-image__done').style.display = "none";
    main.querySelector('.upload-image__main').addEventListener('dragover', this.handleDragOver.bind(this), false);
    main.querySelector('.upload-image__main').addEventListener('drop', this.handleFileSelect.bind(this), false);
    main.querySelector('.upload-image__main').addEventListener('click', this.handleFileSelectClick.bind(this), false);
    main.querySelector('.upload-image__drop_actions > a:nth-child(2)').addEventListener('click', this.handleCancel.bind(this), false);
    main.querySelector('.upload-image__drop_actions > a.special').addEventListener('click', this.handlePassage.bind(this), false);
    main.querySelector('.upload-image__done > a.special').addEventListener('click', this.handleChangeImage.bind(this), false);
    ele.parentNode.insertBefore(main, ele);
    main.appendChild(ele);

    this.ele = main;
    this.viewport = viewport || {};
    this.result = result || {};
    this.cropData = undefined;
    this.callback = callback || function () {};
    this.failure = failure || function () {};

    return this;
  };
  ImageUpload.prototype = {
    handleDragOver: function (evt) {
       evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
       evt.stopPropagation();
       evt.preventDefault();
    },
    handleFileSelect: function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.dataTransfer.files;
      var f = files[0];
      var that = this;
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var main = that.ele;
        // make part 2 visible
        main.querySelector('.upload-image__main').style.display = "none";
        main.querySelector('.upload-image__drop').style.display = "block";
        main.querySelector('.upload-image__done').style.display = "none";
        // destroy any previous crop object
        if (that.cropData !== undefined) {
          that.cropData.destroy();
          that.cropData = undefined;
        }
        // create new crop object
        var cropObj = main.querySelector('.upload-image__drop_crop');
        that.cropData = new Croppie(cropObj, that.viewport);
        // bind crop object with new image
        that.cropData.bind({
          url: e.target.result
        });
      };
      reader.readAsDataURL(f);
    },
    handleFileSelectClick: function (evt) {
      var input = document.createElement('input');
      input.type = "file";
      input.click();
      var that = this;
      input.addEventListener('change', function (e) {
        var files = e.target.files;
        var f = files[0];
        var reader = new FileReader();
        reader.onloadend = function (e) {
          var main = that.ele;
          // make part 2 visible
          main.querySelector('.upload-image__main').style.display = "none";
          main.querySelector('.upload-image__drop').style.display = "block";
          main.querySelector('.upload-image__done').style.display = "none";
          // destroy any previous crop object
          if (that.cropData !== undefined) {
            that.cropData.destroy();
            that.cropData = undefined;
          }
          // create new crop object
          var cropObj = main.querySelector('.upload-image__drop_crop');
          that.cropData = new Croppie(cropObj, that.viewport);
          // bind crop object with new image
          that.cropData.bind({
            url: e.target.result
          });
        };
        reader.readAsDataURL(f);
      });
    },
    handleCancel: function (evt) {
      var main = this.ele;
      this.cropData.destroy();
      this.cropData = undefined;
      // set main
      main.querySelector('.upload-image__main').style.display = "block";
      main.querySelector('.upload-image__drop').style.display = "none";
      main.querySelector('.upload-image__done').style.display = "none";
    },
    handlePassage: function (evt) {
      var that = this;
      this.cropData.result(this.result).then(function (data) {
        that.callback(data, (function () {
          return function (src) {
            var main = this.ele;
            main.querySelector('.upload-image__main').style.display = "none";
            main.querySelector('.upload-image__drop').style.display = "none";
            main.querySelector('.upload-image__done').style.display = "block";
            main.querySelector('.upload-image__done > img').src = src;
            main.querySelector('input[type=hidden]').value = src;
          }.bind(that);
        })());
      }, function () {
        that.failure((function () {
          return that.handleCancel;
        })());
      });
    },
    handleChangeImage: function (evt) {
      var main = this.ele;
      main.querySelector('.upload-image__done > img').src = "";
      main.querySelector('input[type=hidden]').value = "";
      this.handleCancel();
    }
  };

  // Bind to window
  window.ImageUpload = ImageUpload;
})();
