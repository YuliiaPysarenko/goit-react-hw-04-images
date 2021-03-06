import { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import PropTypes from "prop-types";

import ImageGalleryItem from "./ImageGalleryItem";
import Button from "./Button";
import Modal from "./Modal";

<Oval
  height="100"
  width="100"
  color="grey"
  ariaLabel="loading"
  justify-content="center"
/>;

export default function ImageGallery(props) {
  const [key, setKey] = useState("24634494-a9c983226c04769a6e409a37a");
  const [images, setImages] = useState([]);
  const [totalImagesAmount, setTotalImagesAmount] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState("");
  const [tags, setTags] = useState("");

  const getImages = async () => {
    setLoading(true);
    
    const response = await axios.get(
      `/?q=${props.request}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=12`
    );
    setTotalImagesAmount(response.data.total);
    if(page === 1) {
      setImages([]);
      setImages([...response.data.hits]);
    } else {
      setImages([...images, ...response.data.hits]);
    }
    
  }

  useEffect(() => {
    if (props.request) {
      setPage(1);
      getImages()
      .then(window.scrollTo(0, 0))
      .catch(console.error)
      .finally(setLoading(false))
    }

  }, [props.request]);

  useEffect(() => {
    if (props.request) {
      getImages()
      .catch(console.error)
      .finally(setLoading(false))
    }

  }, [page]);

  const onClickLoadMore = (e) => {
    if (e.target.className === "Button") {
      setPage(() => (page + 1));
    }
  };

  const handleModalOpen = (e) => {
    if (
      e.target.className === "ImageGalleryItem-image" ||
      e.target.className === "Overlay"
    ) {
      setIsModalOpen((prevState) => !prevState);
      setLargeImage(e.currentTarget.dataset.lgimage);
      setTags(e.target.alt);
    } else if (e.key === "Escape" && isModalOpen === true) {
      setIsModalOpen((prevState) => !prevState);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="Loader">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      )}
      {images.length > 0 && (
        <div>
          <ul className="ImageGallery">
            {Object.values(images).map(
              ({ id, webformatURL, largeImageURL, tags }) => (
                <ImageGalleryItem
                  key={id}
                  webformatURL={webformatURL}
                  largeImageURL={largeImageURL}
                  tags={tags}
                  modalOpen={handleModalOpen}
                />
              )
            )}
          </ul>
          {totalImagesAmount > 12 ? (
            <Button onClickLoadMore={onClickLoadMore} />
          ) : null}
          {isLoading ? (
            <div className="Loader">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : null}
          {isModalOpen ? (
            <Modal
              handleModalOpen={handleModalOpen}
              largeImage={largeImage}
              tags={tags}
            />
          ) : null}
        </div>
      )}
      {totalImagesAmount === 0 && (
        <p className="oops-notification">
          Oops, there are no results that match your search :(
        </p>
      )}
    </>
  );
}

ImageGallery.propTypes = {
  request: PropTypes.string.isRequired
}