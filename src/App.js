import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import ImageUploader from "react-images-upload";
import FileSaver from "file-saver";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: null,
      error: " ",
      pictures: [],
      url: "",
      image_id: ""
    };
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onDrop(picture) {
    this.setState({ pictures: picture });
    console.log(this.state);
  }

  onSubmit(e) {
    e.preventDefault();
    const self = this;
    console.log(this.state);
    const formData = new FormData();
    formData.append("file", this.state.pictures[0]);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    //Upload Image
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
        }/image/upload/`,
        formData
      )
      .then(function (response) {
        console.log(response.data.public_id);
        self.addOverlay(response);
      })
      .catch(function (err) {
        console.log(err);
      });
    console.log("Here");
  }

  addOverlay(response) {
    const self = this;
    axios
      .get(
        `https://res.cloudinary.com/oluwaseun/image/upload/l_${
        response.data.public_id
        },r_max,w_400,h_400,x_34,y_34/c_crop,g_face/l_text:Arial_24:Benjamin Alamu,x_315,y_140/testdp.jpg`
      )
      .then(function (response) {
        console.log(response);
        console.log(response.config.url);
        self.setState({ url: response.data });
        FileSaver.saveAs(response.config.url, "image.jpg");
      })
      .catch(function (err) {
        console.log(err);
      });
    console.log("Here");
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <ImageUploader
            buttonText="Select image"
            withPreview={true}
            onChange={this.onDrop}
            fileTypeError="File format not supported. Please select a png or jpg image"
            fileSizeError="Image size is too large"
            imgExtension={[".jpg", ".png",]}
            maxFileSize={5242880}
            singleImage={true}
          />
          <input type="submit" />
        </form>
      </div>
    );
  }
}
