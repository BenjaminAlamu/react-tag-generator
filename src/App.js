import React, { Component } from 'react';
import './App.css';
import Loader from 'react-loader-spinner'
import axios from "axios";
import FileSaver from "file-saver";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: null,
      error: " ",
      pictures: [],
      imagePreviewUrl: "",
      name: "",
      loading: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);

  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ error: "" });
    this.setState({ loading: true });
    const self = this;
    if ((self.state.name.length > 0) && (self.state.file)) {
      const formData = new FormData();
      formData.append("file", this.state.file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      //Upload Image
      axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`,
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
    else if (!self.state.file > 0) {
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
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/l_${
        response.data.public_id
        },h_1300,w_1300,r_max,x_110,y_110/l_text:Futura_92:${self.state.name},x_1070,y_445/${process.env.REACT_APP_CLOUDINARY_IMAGE_OVERLAY}`
      )
      .then(function (response) {
        console.log(response);
        console.log(response.config.url);
        self.setState({ url: response.data });
        FileSaver.saveAs(response.config.url, `${self.state.name}.png`);
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
    let imagePreview;
    const imagePreviewUrl = this.state.imagePreviewUrl;


    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} alt="" />);
    } else {
      imagePreview = (<div className="previewText">Please select an Image for upload</div>);
    }

    if (loading) {
      load = <Loader
        type="ThreeDots"
        color="#00BFFF"
        height="50"
        width="50"
      />;
    }
    else {
      load = "";
    }

    return (
      <div className="App">

        <div className='row'>
          <div className='col-md-6 upload'>
            {load}
            <p className="info">Upload your image here</p>
            <p className='error'>{this.state.error}</p><br />
            {/* Image Uploader */}
            <form onSubmit={this.onSubmit}>
              <input className="fileInput "
                type="file"
                accept='image/*'
                onChange={(e) => this._handleImageChange(e)} />
              <div className="imgPreview">
                {imagePreview}
              </div>
              <div className="form-group">
                <input type="text" className="form-control" value={this.state.name} placeholder="Enter name here" onChange={this.handleChange} />
              </div>
              <input type="submit" value="Create Image" className="btn btn-primary mb-2 upload-btn" />
            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default App;