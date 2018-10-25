import React, { Component } from "react";
import Loader from 'react-loader-spinner'
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
      image_id: "",
      name: "",
      loading: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  onDrop(picture) {
    this.setState({ pictures: picture });
    console.log(this.state);
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const self = this;
    console.log(this.state);
    if ((self.state.name.length > 0) && (self.state.pictures.length > 0)) {
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
          self.setState({ loading: false });
          self.setState({ error: "An error occured please try again" });
        });
    }
    else if (!self.state.pictures.length > 0) {
      self.setState({ error: "Please select an image" });
      self.setState({ loading: false });
    }

    else if (!self.state.name.length > 0) {
      self.setState({ error: "Please enter your name" });
      self.setState({ loading: false });
    }
  }

  addOverlay(response) {
    const self = this;
    axios
      .get(
        `https://res.cloudinary.com/oluwaseun/image/upload/l_${
        response.data.public_id
        },r_max,w_400,h_400,x_34,y_34/c_crop,g_face/l_text:Arial_24:${self.state.name},x_315,y_140/testdp.jpg`
      )
      .then(function (response) {
        console.log(response);
        console.log(response.config.url);
        self.setState({ url: response.data });
        FileSaver.saveAs(response.config.url, `${self.state.name}.jpg`);
        self.setState({ loading: false });
      })
      .catch(function (err) {
        console.log(err);
        self.setState({ loading: false });
        self.setState({ error: "An error occured please try again" });
      });
  }


  render() {
    const loading = this.state.loading
    let load;

    if (loading) {
      load = <Loader
        type="ThreeDots"
        color="#00BFFF"
        height="100"
        width="100"
      />;
    }
    else {
      load = "";
    }
    return (
      <div className="App">
        <div className="row">
          <div className="col-md-6 space-content-between">
            <form onSubmit={this.onSubmit}>
              <ImageUploader
                buttonText="Select image"
                withPreview={true}
                withIcon={false}
                fileContainerStyle={{ width: 70 + '%' }}
                onChange={this.onDrop}
                fileTypeError="File format not supported. Please select a png or jpg image"
                fileSizeError="Image size is too large"
                imgExtension={[".jpg", ".png", "jpeg",]}
                maxFileSize={5242880}
                singleImage={true}
              />
              {this.state.error}<br />
              <div className="form-group">
                <input type="text" className="form-control" value={this.state.name} placeholder="Enter name here" onChange={this.handleChange} />
              </div>
              {/* <label>
                Name:
            <input type="text" value={this.state.name} placeholder="Enter name here" onChange={this.handleChange} />
              </label><br /> */}
              <input type="submit" value="Create Image" className="btn btn-primary mb-2" />
            </form>
            {load}
          </div>
        </div>

      </div>
    );
  }
}
