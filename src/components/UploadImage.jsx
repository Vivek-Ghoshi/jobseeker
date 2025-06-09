import { useDispatch } from "react-redux";
import { setUploadedImage } from "../redux/slices/candidateVerificationSlice";

const UploadImage = ({ image, setImage }) => {
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      dispatch(setUploadedImage(imageURL));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-white w-60 px-6 py-2 h-10 bg-zinc-600 flex items-center justify-center rounded-xl"
      />
      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="w-40 h-40 object-cover rounded-full border-2 border-cyan-400 shadow-md"
        />
      )}
    </div>
  );
};

export default UploadImage;
