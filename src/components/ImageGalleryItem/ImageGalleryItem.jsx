import PropTypes from "prop-types";
import {
  ImageGalleryItemBox,
  ImageGalleryItemImage,
} from "./ImageGalleryItem.styled";
// const ImageGalleryItem = ({ SearchNameImgs }) => {
//   return SearchNameImgs.map(({ id, webformatURL, largeImageURL, tags }) => (
//     <>
//       <li key={id}>
//         <img
//           src={webformatURL}
//           alt={tags}
//           //   onClick={showPicture}
//           // data-url={largeImageURL}
//         />
//       </li>
//     </>
//   ));
// };

// export default ImageGalleryItem;

export default function ImageGalleryItem({ SearchNameImgs }) {
  return (
    <>
      {SearchNameImgs.map((hit) => {
        const { id, webformatURL, largeImageURL, tags } = hit;
        return (
          // <li key={id}>
          <ImageGalleryItemBox
            key={id + Math.random().toString(36).substr(2, 9)}
          >
            <ImageGalleryItemImage
              src={webformatURL}
              alt={tags}
              //   onClick={showPicture}
              data-url={largeImageURL}
            />
          </ImageGalleryItemBox>
        );
      })}
    </>
  );
}

ImageGalleryItem.propTypes = {
  SearchNameImgs: PropTypes.array.isRequired,
  //   showPicture: PropTypes.func,
};
