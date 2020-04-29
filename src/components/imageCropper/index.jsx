import React, { Component, Fragment } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Close } from "assets/icons";
import styled from "styled-components";
import Button from "../button";
import hexToRgba from "utils/hexToRgba";

class ImageCropper extends Component {
  state = {
    cropData: {} // State to handle the cropbox detail as the changes are mades
  };

  static defaultProps = {
    isOpen: true,
    /*
     * Props to set the initial position of the cropbox pass object as shown below
     *   {
     *     top,
     *     left,
     *     height,
     *     width
     *   }
     **/
    cropDetail: {}
  };

  handleClose = e => {
    let { onClose } = this.props;
    if (onClose) {
      onClose(e);
    }
  };

  /**
   * Callback when cropper element loads
   *
   */
  onCropperReady = () => {
    let { cropDetail } = this.props;
    // Set crop data when cropper is ready
    if (Object.keys(cropDetail).length) {
      this.setCropBoxData(cropDetail);
    }
  };

  /**
   * Function to get cropped image
   *
   * @memberof ImageCropper
   */
  getCroppedImage = () => {
    let { cropData } = this.state;
    let { imageSrc } = this.props;
    if (!imageSrc) {
      return null;
    }
    // image in dataUrl
    let dataUrl =
      this.refs.cropper.getCroppedCanvas() &&
      this.refs.cropper.getCroppedCanvas().toDataURL();
    if (this.props.handleSave && dataUrl) {
      this.props.handleSave(dataUrl, cropData);
    }
  };

  /**
   *Function to set cropbox data for setting the cropping lines
   *
   * @param {*} values pass cropped image details{Object} in param
   */
  setCropBoxData = values => {
    this.refs.cropper.setCropBoxData(values);
  };

  onCrop = () => {
    let cropData = this.refs.cropper.getCropBoxData();
    this.setState({ cropData });
  };

  render() {
    let { imageSrc } = this.props;
    if (this.props.isOpen) {
      return (
        <Fragment>
          <CropperPopup>
            <CloseIconWrapper title="Close" onClick={this.handleClose}>
              <CloseIcon title="Close" />
            </CloseIconWrapper>
            <ButtonWrapper>
              <Button
                text="Save"
                width={112}
                type="primary"
                onClick={this.getCroppedImage}
              />
            </ButtonWrapper>
            <Cropper
              ref="cropper"
              src={imageSrc}
              style={{ height: 300, width: "100%" }}
              guides={false}
              zoomable={false}
              zoomOnTouch={false}
              zoomOnWheel={false}
              viewMode={1}
              crop={this.onCrop}
              ready={this.onCropperReady}
            />
          </CropperPopup>
          <CropperWrapper onClick={this.handleClose} />
        </Fragment>
      );
    }
    return null;
  }
}

const CropperWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 16;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
`;

const CloseIconWrapper = styled.span`
  padding: 3px 3px 1px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: ${props => props.theme.SNIPPETS.BOX_SHADOW};
  transform: translate(50%, -50%);
  z-index: 10;
  background-color: ${props => props.theme.COLOR.WHITE};
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const CloseIcon = styled(Close)`
  height: 25px;
  width: 26px;
`;

const CropperPopup = styled.div`
  width: 85%;
  max-width: 873px;
  position: fixed;
  padding: 40px 30px 40px 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props =>
    props.faded
      ? props.theme.COLOR_PALLETE.ARMY_GREY
      : props.theme.COLOR.WHITE};
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 17;
`;

const ButtonWrapper = styled.div`
  height: 30px;
  text-align: right;
  margin-bottom: 20px;

  button {
    width: 112px;
    height: 30px;
  }
`;

export default ImageCropper;
