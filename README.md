# ImageUpload
This project is a little wrapper around [Croppie.js](https://foliotek.github.io/Croppie/).
Croppie is an image cropping library. The aim of this wrapper is to add to the functionality
by making a JS library component that allows drag and drop and click to select files,
followed by image cropping (thanks to Croppie), after which the data is given back,
with the provision of displaying the image with a function.

This library is mainly used in upload image projects.

---
## Usage

First, load Croppie.
Next load the javascript and css files from this library.

```
new ImageUpload(element, message, bindObject, resultObject, sucess, failure);
```
Where:
* `element` - _&lt;HTMLInputElement&gt;_ - Input element where the value is set to where the uploaded image's source. The image manipulator is placed in the place of this element. This element should preferably be an `input[type=hidden]` element.
* `message` - _String_ - The message displayed in the dropzone.
* `bindObject` - _Object_ - Object passed into `Croppie.bind()`.
* `resultObject` - _Object_ - Object passed into `Croppie.result`.
* `sucess` - _function_ - This function is evoked when a result was computable from Croppie. The function gains the following arguments:
  * `data` - The data as requested in resultObject.
  * `displayImage` - Function that when evoked switches the view to the final form of the component. It accepts one argument: `src`. Which is the src of the uploaded image. This is set as the value of the HTML Input element passed into the ImageUpload.
* `failure` - If the function couldn't get the data from Croppie for whatever reason, it throws this error. The function gains the following argument:
  * `cancel` - When evoked, this function will reset the component, losing any data bound to it previously.

---

## Example

```
new ImageUpload({
  HTMLInputElement,
  "Drag and Drop your Image here!<br/>OR<br/>Just click to select your Image.",
  {
    viewport: { width: 200, height: 200 },
    boundary: { width: 300, height: 300 },
    showZoomer: true
  },
  {
    type:'blob',
    format:'png'
  }, function (data, displayImage) {
    var q = URL.createObjectURL(data);
    console.log(q);
    displayImage(q);
  }, function (cancel) {
    alert("Sorry, there seems to have been some problem!");
    cancel();
  }
});
```

---
