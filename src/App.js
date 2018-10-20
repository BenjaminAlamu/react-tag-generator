import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import ImageUploader from "react-images-upload";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: null,
      error: " ",
      pictures: [],
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
    console.log(this.state);
    const formData = new FormData();
    formData.append("file", this.state.pictures[0]);
    formData.append("upload_preset", "bdfdunoz");

    axios
      .post("https://api.cloudinary.com/v1_1/oluwaseun/image/upload/", formData)
      .then(function(response) {
        console.log(response.data.public_id);
        let id = response.data.public_id;
        axios
          .get(
            "https://res.cloudinary.com/oluwaseun/image/upload/l_" +
              id +
              "/mr1gjrqf5ffdwxuqzsuy.png"
          )
          .then(function(response) {
            console.log(response);
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

  overlayImage(e, id) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.pictures[0]);
    formData.append("upload_preset", "bdfdunoz");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/oluwaseun/image/upload/l" +
          id +
          "/customcreative1.jpg",
        {}
      )
      .then(function(response) {
        console.log(response);
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
      </div>
    );
  }
}
