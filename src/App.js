import React, { useState } from 'react'
import Loader from 'react-loader-spinner'
import './App.css'
import axios from 'axios'
import ImageUploader from 'react-images-upload'
import FileSaver from 'file-saver'

function App () {
  const [state, setPageState] = useState({
    text: '',
    file: null,
    error: ' ',
    pictures: [],
    url: '',
    image_id: '',
    name: '',
    loading: false
  })

  // handle change in name value
  const handleChange = (event) => {
    setPageState({ ...state, name: event.target.value })
  }

  // handle picture drop
  const handleImageDrop = (picture) => {
    setPageState({ ...state, pictures: picture })
    console.log(state)
  }

  console.log(state)
  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, pictures } = state
    setPageState({ ...state, loading: true })
    console.log(pictures, name)
    if (name.length > 0 && pictures.length > 0) {
      const formData = new FormData()
      formData.append('file', pictures[0])
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      )
      console.log(
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      )
      //  Upload Image
      axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`,
          formData
        )
        .then(function (response) {
          console.log(response.data.public_id)
          addOverlay(response)
        })
        .catch(function (err) {
          console.log(err)
          setPageState({ ...state, loading: false })
          setPageState({ ...state, error: 'An error occured please try again' })
        })
    } else if (!pictures.length > 0) {
      setPageState({ ...state, error: 'Please select an image' })
      setPageState({ ...state, loading: false })
    } else if (name.length < 0) {
      setPageState({ ...state, error: 'Please enter your name' })
      setPageState({ ...state, loading: false })
    }
  }

  // Add overlay to image
  const addOverlay = (response) => {
    const { name } = state
    axios
      .get(
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/l_${response.data.public_id},r_max,w_400,h_400,x_34,y_34/c_crop,g_face/l_text:Arial_24:${name},x_315,y_140/testdp.jpg`
      )
      .then((response) => {
        console.log(response)
        console.log(response.config.url)
        setPageState({ url: response.data })
        FileSaver.saveAs(response.config.url, `${name}.jpg`)
        setPageState({ ...state, loading: false })
      })
      .catch(function (err) {
        console.log(err)
        setPageState({ ...state, loading: false })
        setPageState({ ...state, error: 'An error occured please try again' })
      })
  }
  const { name, error, loading } = state
  let load
  loading
    ? (load = (
      <Loader
        type='ThreeDots'
        color='#00BFFF'
        height='100'
        width='100'
        className='loader'
      />
    ))
    : (load = '')
  return (
    <div className='App'>
      <div className='row'>
        <div className='col-md-6 space-content-between'>
          <form onSubmit={handleSubmit}>
            <ImageUploader
              buttonText='Select image'
              withPreview
              withIcon
              fileContainerStyle={{ width: 70 + '%' }}
              onChange={handleImageDrop}
              fileTypeError='File format not supported. Please select a png or jpg image'
              fileSizeError='Image size is too large'
              imgExtension={['.jpg', '.png', 'jpeg']}
              maxFileSize={5242880}
              singleImage
            />
            {error}
            <br />
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                value={name}
                placeholder='Enter name here'
                onChange={handleChange}
              />
            </div>
            <input
              type='submit'
              value='Create Image'
              className='btn btn-primary mb-2'
            />
          </form>
          {load}
        </div>
      </div>
    </div>
  )
}
export default App
