import PropTypes from "prop-types";

export default function ImageGalleryItem({ pictures: { hits } }) {
  return (
    <>
      {hits.map((hit) => {
        const { id, webformatURL, largeImageURL, tags } = hit;
        return (
          <li key={id}>
            <img
              src={webformatURL}
              alt={tags}
              //   onClick={showPicture}
              data-url={largeImageURL}
            />
          </li>
        );
      })}
    </>
  );
}

ImageGalleryItem.propTypes = {
  pictures: PropTypes.shape(PropTypes.arrayOf).isRequired,
  //   showPicture: PropTypes.func,
};
