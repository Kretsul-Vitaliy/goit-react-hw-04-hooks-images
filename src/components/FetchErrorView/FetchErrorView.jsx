import errorImage from "../../image/error-img-api.webp";

export default function FetchErrorView({ message }) {
  return (
    <div role="alert">
      <img
        src={errorImage}
        width="240"
        alt="There are no images with this name"
      />
      <p>{message}</p>
    </div>
  );
}
