import React, { Component } from "react";
import interact from "interactjs";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import SLIDE_PREVIEW_DATA from "./slideData";

const Container = Main =>
  class SlidePreviewContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        imageWidth: null,
        newImageWidth: 0,
        newImageHeight: 0,
        imageDataX: 0,
        imageDataY: 0,
        imageLeftPosition: 0,
        imageTopPosition: 0,
        slideImageError: false,
        selectedImage: 0,
        imageEditedData: {},
        previewData: SLIDE_PREVIEW_DATA[0],
        selectedSlide: 0,
        slideImageEditable: false,
        openConfirmationPopup: false,
        slideData: {},
        isSlidePreviewToggleOpen: true,
        isSlideTitleEditable: false,
        slideAspectRatio: { x: 16, y: 9 },
        isRerenderdSlideTitle: false,
        isWindowResize: false,
        isShowPreviewImage: true,
        showDownloadDropdown: false,
        showShadowScroll: true
      };

      this.draggableContainer = React.createRef();
      this.draggableElement = React.createRef();
      this.slideContentWrapper = React.createRef();
      this.slidePreviewMainContainer = React.createRef();
      this.slideComponentContainer = React.createRef();
      this.slideDynamics = React.createRef();
      this.slideTitle = React.createRef();
      this.slidePreviewContentWrapper = React.createRef();
      this.sliderLength = 0;
    }

    componentDidMount() {
      window.addEventListener("resize", this._onWindowResize);

      this.props._renderSlideData();
      setTimeout(() => {
        this._resetDraggableElemntFocal();
        this._updateDraggableElementFocal();
      }, 200);
    }

    componentDidUpdate() {
      this._updateDraggableElementFocal();
    }

    _onWindowResize = () => {
      this.setState(
        {
          isWindowResize: true
        },
        () => {
          this.setState({
            isWindowResize: false
          });
        }
      );
    };

    //TODO: this is commented for now but this is the code for functionality of edit cta click
    // _onClickEditCta = () => {
    //   this.setState(
    //     {
    //       slideImageEditable: true
    //     },
    //     () => {
    //       this._initDragDropResize();
    //       this._initZoomingEvent();
    //     }
    //   );
    // };

    /** Remove all dragdrop, resize and zooming event */
    _removeEventListener = () => {
      interact(".draggable-element").draggable({
        enabled: false
      });

      interact(".draggable-element").resizable({
        enabled: false
      });

      let zoomContainer = this.draggableContainer.current;
      zoomContainer.removeEventListener("wheel", () => {}, true);

      this.setState({
        slideImageEditable: false
      });
    };

    _resetDraggableElemntFocal = () => {
      let draggableImage = this.draggableElement.current;
      if (draggableImage) {
        draggableImage.style.width = "100%";
      }
    };

    //This function is used to calculate the draggable Image width and also the position of the Image
    _updateDraggableElementFocal = () => {
      let draggableContainer = this.draggableContainer.current;
      let draggableImage = this.draggableElement.current;
      let slideContentWrapper = this.slideContentWrapper.current;

      if (draggableImage && draggableContainer) {
        const draggableImageWidth = draggableImage.clientWidth;
        const draggableContainerWidth = draggableContainer.clientWidth;
        const draggableContainerHeight = draggableContainer.clientHeight;

        if (draggableImageWidth && draggableContainerWidth) {
          draggableImage.style.width = "auto";
          draggableImage.style.height = `auto`;

          let imageTop = draggableImage.style.top;
          let imageLeft = draggableImage.style.left;

          let dataX = 0;
          let dataY = 0;
          if (imageLeft.indexOf("px") === -1) {
            imageLeft = imageLeft.substring(0, imageLeft.length - 1);
            dataX = draggableContainerWidth * (imageLeft / 100);
          }

          if (imageTop.indexOf("px") === -1) {
            imageTop = imageTop.substring(0, imageTop.length - 1);
            imageTop = parseFloat(imageTop);
            dataY = draggableContainerHeight * (imageTop / 100);
          }

          draggableImage.setAttribute("data-x", dataX);
          draggableImage.setAttribute("data-y", dataY);
          let SlideWrapperWidth = slideContentWrapper.getAttribute(
            "data-width"
          );

          draggableImage.style.height = `auto`;
          draggableImage.style.width = `${SlideWrapperWidth}px`;
        }
      } else if (draggableImage) {
        draggableImage.style.maxWidth = `unset`;
        draggableImage.style.minWidth = `unset`;
        draggableImage.style.minHeight = `unset`;
        draggableImage.style.maxHeight = `unset`;
        this._updateDraggableElementFocal();
      }
    };

    _resetPreviewImageChanges = () => {
      let {
        slideData,
        imageEditedData,
        selectedSlide,
        selectedImage
      } = this.state;

      imageEditedData = {};
      this._clearImageElementProperty();
      this._removeEventListener();

      if (slideData && slideData[selectedSlide]) {
        const selectedSlideData = slideData[selectedSlide];
        imageEditedData[selectedSlideData.selectedImage] = selectedSlideData;

        if (selectedSlideData.selectedImage === selectedImage) {
          this._resetDraggableElemntFocal();
          this._clearImageElementProperty(selectedSlideData);
        } else {
          this._resetDraggableElemntFocal();
          this._updateDraggableElementFocal();
        }
      } else {
        this.setState(
          {
            isShowPreviewImage: false
          },
          () => {
            this.setState(
              {
                isShowPreviewImage: true
              },
              () => {
                this._resetDraggableElemntFocal();
                this._updateDraggableElementFocal();
              }
            );
          }
        );
      }
    };

    /** Clear draggable image properties */
    _clearImageElementProperty = data => {
      this.setState(
        {
          isShowPreviewImage: false
        },
        () => {
          this.setState(
            {
              isShowPreviewImage: true
            },
            () => {
              let draggableElement = this.draggableElement.current;

              let x = (data && data.dataX) || 0;
              let y = (data && data.dataY) || 0;

              draggableElement.setAttribute("data-x", x);
              draggableElement.setAttribute("data-y", y);

              draggableElement.style.width = data
                ? `${data.imageWidth}px`
                : "100%";
            }
          );
        }
      );
    };

    _saveCurrentImageChanges = () => {
      let { imageEditedData, selectedImage } = this.state;
      const oldSelectedImage = selectedImage;
      let draggableElement = this.draggableElement.current;
      let imageWidth = draggableElement.clientWidth;
      let imageHeight = draggableElement.clientHeight;

      let dataX = draggableElement.getAttribute("data-x") || 0;
      let dataY = draggableElement.getAttribute("data-y") || 0;

      if ((dataX && dataX !== 0) || (dataY && dataY !== 0)) {
        let imageData = {
          imageWidth,
          imageHeight,
          dataX,
          dataY
        };

        if (!imageEditedData[oldSelectedImage]) {
          imageEditedData[oldSelectedImage] = {};
        }

        imageEditedData[oldSelectedImage] = imageData;
      }

      this.setState({
        imageEditedData,
        slideImageEditable: false
      });

      return imageEditedData;
    };

    /** Call function after click on next or prev image cta (called on slider click)*/
    _onClickPrevNextImageCta = value => {
      let { selectedImage } = this.state;
      if (value === 1) {
        selectedImage = selectedImage - 1;
      } else {
        selectedImage = selectedImage + 1;
      }
      // mergedSliderData
      if (selectedImage < 0 || selectedImage > this.sliderLength - 1) return;

      const imageEditedData = this._saveCurrentImageChanges();
      if (imageEditedData[selectedImage]) {
        const data = imageEditedData[selectedImage];
        this._clearImageElementProperty(data);
      } else {
        setTimeout(() => {
          this._resetDraggableElemntFocal();
          this._updateDraggableElementFocal();
        }, 50);
      }

      this.setState(
        {
          selectedImage,
          slideImageError: false
        },
        () => {
          this._removeEventListener();
          if (!imageEditedData[selectedImage]) {
            setTimeout(() => {
              this._resetDraggableElemntFocal();
              this._updateDraggableElementFocal();
            }, 50);
          } else {
            //TODO: This will be added once edit presentation functionality is implemented
            // this.setState({
            //   slideImageEditable: true
            // }, () => {
            //   this._initDragDropResize();
            //   this._initZoomingEvent();
            // })
          }
        }
      );
    };

    /** Call function after click on next or prev slide cta */
    _onClickPrevNextSlideCta = value => {
      let {
        selectedSlide,
        selectedImage,
        // slideData,
        slideImageEditable
      } = this.state;

      // let oldSelectedSlide = selectedSlide;
      if (value === 1) {
        selectedSlide = selectedSlide - 1;
      } else {
        selectedSlide = selectedSlide + 1;
      }

      if (selectedSlide < 0 || selectedSlide > SLIDE_PREVIEW_DATA.length - 1)
        return;
      const imageEditedData = this._saveCurrentImageChanges();
      if (imageEditedData[selectedImage] && slideImageEditable) {
        this._openConfirmationAlert({ selectedSlide });
        return false;
      } else {
        this._onSwitchToNextSlide({ selectedSlide });
      }
    };

    // called on bottom slider next/previous click
    _onSwitchToNextSlide = ({ selectedSlide }) => {
      let { slideData, imageEditedData } = this.state;

      imageEditedData = {};
      this._clearImageElementProperty();
      this._removeEventListener();

      if (slideData && slideData[selectedSlide]) {
        const selectedSlideData = slideData[selectedSlide];
        imageEditedData[selectedSlideData.selectedImage] = selectedSlideData;

        this.setState({
          selectedImage: 0
        });
        if (selectedSlideData.selectedImage === 0) {
          this._resetDraggableElemntFocal();
          this._clearImageElementProperty(selectedSlideData);
        }
      }

      this.setState(
        {
          selectedSlide,
          previewData: SLIDE_PREVIEW_DATA[selectedSlide],
          selectedImage: 0,
          imageEditedData: imageEditedData,
          slideImageError: false,
          isRerenderdSlideTitle: true
        },
        () => {
          this.setState({
            isRerenderdSlideTitle: false
          });
          let selectedData = (slideData && slideData[selectedSlide]) || {};

          if (selectedData && selectedData.selectedImage !== 0) {
            setTimeout(() => {
              this._resetDraggableElemntFocal();
              this._updateDraggableElementFocal();
            }, 50);
          } else if (!selectedData) {
            setTimeout(() => {
              this._resetDraggableElemntFocal();
              this._updateDraggableElementFocal();
            }, 50);
          }
        }
      );
    };

    _onClickConfirmarionCta = ({ value, selectedSlide }) => {
      if (value === "yes") {
        let response = this._imageCoOrdinatesCalculation();
        if (!response) {
          return;
        }
      }

      this._onSwitchToNextSlide({ selectedSlide });
    };

    _openConfirmationAlert = ({ selectedSlide }) => {
      confirmAlert({
        message: "Do you want to save the changes you made?",
        buttons: [
          {
            label: "Yes",
            onClick: () =>
              this._onClickConfirmarionCta({ value: "yes", selectedSlide })
          },
          {
            label: "No",
            onClick: () =>
              this._onClickConfirmarionCta({ value: "no", selectedSlide })
          }
        ]
      });
    };

    /** Image co-ordinates calculation for aspose library data */
    _imageCoOrdinatesCalculation = () => {
      const { imageWidth, imageHeight, selectedImage } = this.state;

      const boundaryBox = this.draggableContainer.current;
      let boundaryBoxWidth = boundaryBox.clientWidth;
      let boundaryBoxHeight = boundaryBox.clientHeight;

      const newImage = this.draggableElement.current;
      let newImageWidth = newImage.clientWidth;
      let newImageHeight = newImage.clientHeight;

      let imageDataX = newImage.getAttribute("data-x") || 0;
      let imageDataY = newImage.getAttribute("data-y") || 0;

      let imageLeftPosition = 0;
      let imageTopPosition = 0;

      if (imageDataX < 0) {
        let DataX = -imageDataX;
        imageLeftPosition = `-${DataX / newImageWidth / 100}%`;
      } else {
        imageLeftPosition = `${imageDataX / boundaryBoxWidth / 100}%`;
      }

      if (imageDataY < 0) {
        let DataY = -imageDataY;
        imageTopPosition = `-${DataY / newImageHeight / 100}%`;
      } else {
        imageTopPosition = `${imageDataY / boundaryBoxHeight / 100}%`;
      }

      let slideImageError = false;

      if (
        newImageWidth < boundaryBoxWidth ||
        newImageHeight < boundaryBoxHeight
      ) {
        slideImageError = true;
      } else if (
        newImageWidth >= boundaryBoxWidth &&
        newImageHeight >= boundaryBoxHeight
      ) {
        if (imageDataX < 0 && newImageWidth - -imageDataX < boundaryBoxWidth) {
          slideImageError = true;
        } else if (imageDataX > 0) {
          slideImageError = true;
        }

        if (imageDataY < 0 && newImageWidth - -imageDataY < boundaryBoxHeight) {
          slideImageError = true;
        } else if (imageDataY > 0) {
          slideImageError = true;
        }
      }

      if (slideImageError) {
        this.setState({
          slideImageError: true
        });

        confirmAlert({
          message: `Make sure there isn't any white space left.`,
          buttons: [
            {
              label: "Ok",
              onClick: () => console.log("ok")
            }
          ]
        });
        return false;
      } else {
        this.setState({
          slideImageError: false
        });
      }

      let newImageWidthPx = newImageWidth;
      let newImageHeightPx = newImageHeight;

      newImageWidth = `${(newImageWidth / imageWidth) * 100}%`;
      newImageHeight = `${(newImageHeight / imageHeight) * 100}%`;

      const { slideData, selectedSlide } = this.state;

      let selectedSlideData = {};
      if (slideData[selectedSlide]) {
        selectedSlideData = slideData[selectedSlide];
      } else {
        slideData[selectedSlide] = {};
      }

      selectedSlideData = {
        selectedImage,
        newImageWidth,
        newImageHeight,
        imageDataX,
        imageDataY,
        imageLeftPosition,
        imageTopPosition,
        imageWidth: newImageWidthPx,
        imageHeight: newImageHeightPx,
        dataX: imageDataX,
        dataY: imageDataY
      };

      slideData[selectedSlide] = selectedSlideData;

      this.setState({
        newImageWidth,
        newImageHeight,
        imageDataX,
        imageDataY,
        imageLeftPosition,
        imageTopPosition,
        slideData,
        slideImageEditable: false
      });

      return true;
    };

    /** Zooming functionality */
    _initZoomingEvent = () => {
      let ZoomElement = this.draggableElement.current;
      let zoomContainer = this.draggableContainer.current;
      // let zX = 1;
      zoomContainer.addEventListener("wheel", event => {
        const { slideImageEditable } = this.state;
        if (slideImageEditable) {
          // let dir;
          if (!event.ctrlKey) {
            if (!event.metaKey) {
              return;
            }
          }

          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);

          console.log(ZoomElement);
          if (
            ZoomElement &&
            (ZoomElement.clientWidth < 50 || ZoomElement.clientHeight < 50) &&
            !(event.deltaY > 0)
          )
            return;
          const widthAspect = 20;
          const heightAspect =
            (ZoomElement.clientHeight * widthAspect) / ZoomElement.clientWidth;
          let widthDir = event.deltaY > 0 ? widthAspect : -widthAspect;
          let heightDir = event.deltaY > 0 ? heightAspect : -heightAspect;
          // zX += event.deltaY > 0 ? 20 : -20;
          ZoomElement.style.width = `${ZoomElement.clientWidth + widthDir}px`;
          ZoomElement.style.height = `${ZoomElement.clientHeight +
            heightDir}px`;
          console.log(ZoomElement.clientWidth + widthDir, "11111 width");
          console.log(ZoomElement.clientHeight + heightDir, "2222 height");
          // keep the dragged position in the data-x/data-y attributes
          let x =
            (parseFloat(ZoomElement.getAttribute("data-x")) || 0) -
            widthDir / 2;
          let y =
            (parseFloat(ZoomElement.getAttribute("data-y")) || 0) -
            heightDir / 2;
          console.log(
            x,
            parseFloat(ZoomElement.getAttribute("data-x")),
            "33333 x"
          );
          console.log(
            x,
            parseFloat(ZoomElement.getAttribute("data-x")),
            "33333 y"
          );
          // translate the element
          ZoomElement.style.webkitTransform = ZoomElement.style.msTranform = ZoomElement.style.transform =
            "translate(" + x + "px, " + y + "px)";

          // update the posiion attributes
          ZoomElement.setAttribute("data-x", x);
          ZoomElement.setAttribute("data-y", y);
          ZoomElement.style.maxWidth = `unset`;
          ZoomElement.style.minWidth = `unset`;
          ZoomElement.style.minHeight = `unset`;
          ZoomElement.style.maxHeight = `unset`;
          return;
        }
      });
    };

    /** initilize dragdrop and resize functionality */
    _initDragDropResize = () => {
      // this is used later in the resizing and gesture demos
      window.dragMoveListener = this._dragMoveListener;
      interact(".draggable-element")
        .draggable({
          onmove: window.dragMoveListener,
          modifiers: [
            interact.modifiers.restrict({
              restriction: "parent",
              elementRect: { top: 1, left: 1, bottom: 0, right: 0 }
            })
          ]
        })
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          modifiers: [
            // keep the edges inside the parent
            // interact.modifiers.restrictEdges({
            //   outer: 'parent',
            //   endOnly: true,
            // }),

            // minimum size
            interact.modifiers.restrictSize({
              min: { width: 100, height: 50 }
            })
          ],

          inertia: true
        })
        .on("resizemove", event => {
          const { slideImageEditable } = this.state;

          if (!slideImageEditable) return;
          var target = event.target,
            x = parseFloat(target.getAttribute("data-x")) || 0,
            y = parseFloat(target.getAttribute("data-y")) || 0;

          let parentWidth = target.parentNode.clientWidth;
          let parentHeight = target.parentNode.clientHeight;

          // add limit for resize on X axis
          if (event.deltaRect.left <= 0) {
            if (x < -(event.rect.width - 50)) {
              return false;
            }
          } else if (x > parentWidth - 50) {
            return false;
          }

          // add limit for resize on Y axis
          if (event.deltaRect.top <= 0) {
            if (y < -(event.rect.height - 50)) {
              return false;
            }
          } else if (y > parentHeight - 50) {
            return false;
          }
          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.webkitTransform = target.style.transform =
            "translate(" + x + "px," + y + "px)";

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          target.textContent =
            Math.round(event.rect.width) +
            "\u00D7" +
            Math.round(event.rect.height);
        });
    };

    _dragMoveListener = event => {
      const { slideImageEditable } = this.state;
      if (!slideImageEditable) return;

      var target = event.target;
      let parentWidth = target.parentNode.clientWidth;
      let parentHeight = target.parentNode.clientHeight;

      // keep the dragged position in the data-x/data-y attributes
      let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // add limit for drag and drop on X axix
      if (event.dx < 0) {
        if (x < -(target.clientWidth - 50)) {
          return false;
        }
      } else if (x > parentWidth - 50) {
        return false;
      }

      // add limit for drag and drop on Y axis
      if (event.dy < 0) {
        if (y < -(target.clientHeight - 50)) {
          return false;
        }
      } else if (y > parentHeight - 50) {
        return false;
      }
      // translate the element
      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";

      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    };

    _onClickSlideBarToggle = () => {
      this.setState({
        isSlidePreviewToggleOpen: !this.state.isSlidePreviewToggleOpen
      });

      //this is used to handle scrollbar. This will display the scroll bar after some delay
      setTimeout(() => {
        this.setState({
          showShadowScroll: !this.state.showShadowScroll
        });
      }, 450);
    };

    _calculateSlideWidthHeight = ({ asspectRatio, slidePreviewDimensions }) => {
      let asspectRatioX = asspectRatio.x,
        asspectRatioY = asspectRatio.y,
        slidePreviewWidth = slidePreviewDimensions.width,
        slidePreviewHeight = slidePreviewDimensions.height,
        slideWidth = slidePreviewWidth,
        slideHeight = slidePreviewHeight;

      if (asspectRatioX > asspectRatioY) {
        slideHeight = (asspectRatioY * slidePreviewWidth) / asspectRatioX;
        if (slideHeight > slidePreviewHeight) {
          return this._calculateSlideWidthHeight({
            asspectRatio,
            slidePreviewDimensions: {
              width: slidePreviewWidth - 26,
              height: slidePreviewHeight
            }
          });
        }
      } else if (asspectRatioX < asspectRatioY) {
        slideWidth = (asspectRatioX * slidePreviewHeight) / asspectRatioY;

        if (slideWidth > slidePreviewWidth) {
          return this._calculateSlideWidthHeight({
            asspectRatio,
            slidePreviewDimensions: {
              width: slidePreviewWidth,
              height: slidePreviewHeight - 10
            }
          });
        }
      } else {
        if (slidePreviewWidth < slidePreviewHeight) {
          slideHeight = (asspectRatioY * slidePreviewWidth) / asspectRatioX;
        } else if (slidePreviewWidth > slidePreviewHeight) {
          slideWidth = (asspectRatioX * slidePreviewHeight) / asspectRatioY;
        }
      }
      return { slideWidth, slideHeight };
    };

    _onClickSlideTitleEdit = () => {
      this.setState(
        {
          isSlideTitleEditable: true
        },
        () => {
          let inputField = this.slideTitle.current;
          if (inputField) inputField.focus();
          this.props.focusInputHandler();
          this.props.setSlideTitle(this.props.title, true);
        }
      );
    };

    _onClickSaveSlideTitle = () => {
      let inputField = this.slideTitle.current;
      let { previewData } = this.state;
      if (!this.props.saveSlideTitle()) {
        return;
      }

      if (inputField && inputField.value.trim() !== "") {
        previewData.slideTitle = inputField.value;

        this.setState({
          previewData,
          isSlideTitleEditable: false
        });
      } else {
        this.setState(
          {
            previewData,
            isSlideTitleEditable: false,
            isRerenderdSlideTitle: true
          },
          () => {
            this.setState({
              isRerenderdSlideTitle: false
            });
          }
        );
      }
    };

    _onClickResetSlideTitle = () => {
      let inputField = this.slideTitle.current;

      if (inputField) {
        // revert to old name
        this.props.setSlideTitle(null, true);

        this.setState(
          {
            isSlideTitleEditable: false,
            isRerenderdSlideTitle: true
          },
          () => {
            this.setState({
              isRerenderdSlideTitle: false
            });
          }
        );
      }
    };

    //TODO: THis will be added when user has the feasibility to select the aspect ratio
    //To select the aspect ratio
    // _selectAspectRatio = () => {
    //   let inputX = document.querySelector("#aspect-x");
    //   let inputY = document.querySelector("#aspect-y");
    //   console.log(inputX);
    //   let slideAspectRatio = { x: inputX.value || 2, y: inputY.value || 1 };

    //   this.setState({
    //     slideAspectRatio
    //   });
    // };

    handleDropDown = () => {
      this.setState({
        showDownloadDropdown: !this.state.showDownloadDropdown
      });
    };

    handleDownloadDropDown = e => {
      if (
        (!e.target.classList.contains("drop-down-wrapper") ||
          !e.target.classList.contains("DownloadCtaWrapper")) &&
        this.state.showDownloadDropdown
      ) {
        this.setState({
          showDownloadDropdown: !this.state.showDownloadDropdown
        });
      }
    };

    render() {
      const $this = this;

      return (
        <div>
          <Main
            {...this.props}
            {...this.state}
            {...$this}
            onClickEditCta={this._onClickEditCta}
            onClickPrevNextSlideCta={this._onClickPrevNextSlideCta}
            imageCoOrdinatesCalculation={this._imageCoOrdinatesCalculation}
            onClickPrevNextImageCta={this._onClickPrevNextImageCta}
            onClickSlideBarToggle={this._onClickSlideBarToggle}
            calculateSlideWidthHeight={this._calculateSlideWidthHeight}
            onClickSlideTitleEdit={this._onClickSlideTitleEdit}
            onClickResetSlideTitle={this._onClickResetSlideTitle}
            onClickSaveSlideTitle={this._onClickSaveSlideTitle}
            selectAspectRatio={this._selectAspectRatio}
            updateDraggableElementFocal={this._updateDraggableElementFocal}
            saveCurrentImageChanges={this._saveCurrentImageChanges}
            resetPreviewImageChanges={this._resetPreviewImageChanges}
          />
        </div>
      );
    }
  };
export default Container;
