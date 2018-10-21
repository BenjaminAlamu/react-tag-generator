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
    this.setState({ pictures: this.state.pictures.concat(picture) });
    console.log(this.state);
  }

  onSubmit(e) {
    e.preventDefault();
    const that = this;
    console.log(this.state);
    const formData = new FormData();
    formData.append("file", this.state.pictures[0]);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    axios
      .post(
        `https://api.cloudinary.com/v1_1/${
          process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
        }/image/upload/`,
        formData
      )
      .then(function(response) {
        console.log(response.data.public_id);
        axios
          .get(
            `https://res.cloudinary.com/oluwaseun/image/upload/l_${
              response.data.public_id
            }/${process.env.REACT_APP_CLOUDINARY_IMAGE_OVERLAY}`
          )
          .then(function(response) {
            console.log(response);
            console.log(response.config.url);
            that.setState({ url: response.data });
            FileSaver.saveAs(response.config.url, "image.png");
          })
          .catch(function(err) {
            console.log(err);
          });
        console.log("Here");
      })
      .catch(function(err) {
        console.log(err);
      });
    console.log("Here");
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <ImageUploader
            withIcon={true}
            withPreview={true}
            buttonText="Choose images"
            onChange={this.onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />
          <input type="submit" />
        </form>
        <p>jfdjfsdbjf</p>
        <a href={this.state.url} download>
          {" "}
          Download
        </a>
      </div>
    );
  }
}
