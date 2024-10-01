"use client";
import { useState, useRef, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Game, Platform, platforms, genres } from "@/types/game";
import slugify from "@sindresorhus/slugify";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";

interface GameFormProps {
  game?: Game;
  submitType?: "add" | "update";
  onSubmit: (game: Game) => void;
  onChanges?: (game: Game) => void;
}

const GameForm = ({
  game,
  submitType = "add",
  onSubmit,
  onChanges,
}: GameFormProps) => {
  const storage = getStorage();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    game_id: game?.id || "",
    name: game?.name || "",
    alternative_names: game?.alternative_names || [],
    slug: game?.slug || "",
    description: game?.description || "",
    released: game?.released || new Date().toDateString(),
    background_image: game?.background_image || "",
    platforms: game?.platforms || [],
    genres: game?.genres || [],
    rating: game?.rating || 1,
  };

  useEffect(() => {
    if (game && submitType === "add") {
      const platforms = game.platforms.map(
        (platformObj: any) => platformObj.platform.name
      );
      const genres = game.genres.map((genreObj: any) => genreObj.name);

      formik.setValues({
        game_id: game.id || "",
        name: game.name || "",
        alternative_names: game.alternative_names || [],
        slug: slugify(game.name) || "",
        description: game.description_raw || "",
        released: game.released || new Date().toDateString(),
        background_image: game.background_image || "",
        platforms: platforms || [],
        genres: genres || [],
        rating: game.rating || 1,
      });
      setImagePreview(game.background_image);
      setImageFile(null);
    }
  }, [game]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loading]);

  // const handleImageUpload = async (file: File) => {
  //   const storageRef = ref(storage, `games/${file.name}`);
  //   await uploadBytes(storageRef, file);
  //   return await getDownloadURL(storageRef);
  // };

  // const handleImageUpload = async (file: File) => {
  //   const storageRef = ref(storage, `game/${file.name}`);
  //   await uploadBytes(storageRef, file);
  //   const downloadURL = await getDownloadURL(storageRef);
  //   return downloadURL;
  // };

  const getImageBlobFromUrl = (
    imageUrl: string,
    maxWidth: number = 1200,
    maxHeight: number = 1200
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous"; // Handle CORS issues
      img.src = imageUrl;

      img.onload = () => {
        // Calculate the new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create a canvas and draw the resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Unable to create Blob"));
              }
            },
            "image/jpeg",
            0.8
          ); // You can adjust the image quality here (0.0 to 1.0)
        } else {
          reject(new Error("Unable to create Canvas context"));
        }
      };

      img.onerror = (err: any) => {
        reject(err);
      };
    });
  };

  const uploadImageBlobToFirebase = async (
    blob: Blob,
    fileName: string
  ): Promise<string> => {
    const storageRef = ref(storage, `games/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = async () => {
    if (imageFile) {
      try {
        setImageFile(null);
        setImagePreview(null);
        formik.setFieldValue("background_image", "");
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const formik = useFormik<Game>({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      alternative_names: Yup.array().of(Yup.string()),
      slug: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      released: Yup.date().required("Required"),
      background_image: Yup.string().required("Required"),
      platforms: Yup.array().of(Yup.string()).required("Required"), // Düzeltildi
      genres: Yup.array().of(Yup.string()).required("Required"), // Düzeltildi
      rating: Yup.number().min(0).max(10),
    }),

    onSubmit: async (values: Game, { resetForm }: FormikHelpers<Game>) => {
      setLoading(true);
      try {
        if (values.background_image && submitType === "add") {
          // Görseli al ve Firebase Storage'a yükle
          const imageBlob = await getImageBlobFromUrl(values.background_image);
          const firebaseImageUrl = await uploadImageBlobToFirebase(
            imageBlob,
            `${values.slug}.jpg`
          );
          values.background_image = firebaseImageUrl;
        }
        onSubmit(values);
        resetForm();
        setLoading(false);
        setImageFile(null);
        setImagePreview(null);
        inputRef.current && (inputRef.current.value = "");
      } catch (e) {
        console.error("Error adding game: ", e);
      }
    },
  });

  const handlePlatformChange = (platform: string) => {
    if (formik.values.platforms.includes(platform)) {
      formik.setFieldValue(
        "platforms",
        formik.values.platforms.filter((p) => p !== platform)
      );
    } else {
      formik.setFieldValue("platforms", [...formik.values.platforms, platform]);
    }
  };

  const handleGenreChange = (genre: string) => {
    if (formik.values.genres.includes(genre)) {
      formik.setFieldValue(
        "genres",
        formik.values.genres.filter((g) => g !== genre)
      );
    } else {
      formik.setFieldValue("genres", [...formik.values.genres, genre]);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="game-form">
      {submitType === "add" && (
        <button
          type={loading ? "button" : "submit"}
          className="btn btn-light"
          disabled={loading}
          style={{
            position: "absolute",
            top: "-3.4rem",
            right: "0",
          }}
        >
          {loading ? "Loading..." : "Add Game"}
        </button>
      )}

      <div className={"loading-overlay" + (loading ? " d-flex" : " d-none")}>
        <div className="spinner-border" role="status"></div>
        <p className="mt-2">Loading...</p>
      </div>
      <div className="mb-3">
        <label className="mb-2">Game Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Game Name"
          value={formik.values.name}
          onChange={(e) => {
            formik.setFieldValue("name", e.target.value);
            formik.setFieldValue("slug", slugify(e.target.value));
            onChanges &&
              onChanges(
                Object.assign(formik.values, {
                  name: e.target.value,
                  slug: slugify(e.target.value),
                })
              );
          }}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-danger">{formik.errors.name}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label className="mb-2">Slug</label>
        <input
          type="text"
          className="form-control"
          placeholder="Slug"
          {...formik.getFieldProps("slug")}
        />
        {formik.touched.slug && formik.errors.slug ? (
          <div className="text-danger">{formik.errors.slug}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label className="mb-2">Description</label>
        <textarea
          className="form-control"
          placeholder="Game Description"
          rows={13}
          {...formik.getFieldProps("description")}
        ></textarea>
        {formik.touched.description && formik.errors.description ? (
          <div className="text-danger">{formik.errors.description}</div>
        ) : null}
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="mb-2">Release Date</label>
            <input
              type="date"
              className="form-control"
              placeholder="Release Date"
              {...formik.getFieldProps("released")}
            />
            {formik.touched.released && formik.errors.released ? (
              <div className="text-danger">{formik.errors.released}</div>
            ) : null}
          </div>

          <div className="mb-2" style={{ width: "200px" }}>
            <div className="input-group">
              <span className="input-group-text">Rating</span>
              <input
                type="number"
                className="form-control text-center"
                placeholder="Rating"
                {...formik.getFieldProps("rating")}
              />
            </div>
            {formik.touched.rating && formik.errors.rating ? (
              <div className="text-danger">{formik.errors.rating}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="mb-2">Alternative Names</label>
            <input
              type="text"
              className="form-control"
              placeholder="Alternative Names"
              value={formik.values.alternative_names?.join(", ") ?? ""}
              onChange={(e) => {
                formik.setFieldValue(
                  "alternative_names",
                  e.target.value.split(",").map((name) => name.trim())
                );
              }}
            />

            {formik.touched.alternative_names &&
            formik.errors.alternative_names ? (
              <div className="text-danger">
                {formik.errors.alternative_names}
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-md-6 ms-auto">
          <label className="mb-2">Background Image</label>
          <div className="mb-2 d-flex flex-column gap-3">
            <input
              type="file"
              className="form-control"
              ref={inputRef}
              onChange={handleImageChange}
            />
            {formik.touched.background_image &&
            formik.errors.background_image ? (
              <div className="text-danger">
                {formik.errors.background_image}
              </div>
            ) : null}
            {imagePreview && (
              <div className="d-flex gap-3 align-items-start">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={320}
                  height={180}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="btn btn-danger"
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="my-3">
            <label className="mb-2">Platforms</label>
            <div className="d-flex gap-3 flex-wrap border rounded border-light p-3">
              {platforms.map((platform) => (
                <div key={platform}>
                  <input
                    type="checkbox"
                    id={`platform-${platform}`}
                    name="platforms"
                    value={platform}
                    className="btn-check"
                    onChange={() => handlePlatformChange(platform)}
                    checked={formik.values.platforms.includes(
                      platform as Platform
                    )}
                  />
                  <label htmlFor={`platform-${platform}`} className="btn">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.platforms && formik.errors.platforms ? (
              <div className="text-danger">{formik.errors.platforms}</div>
            ) : null}
          </div>
        </div>
        <div className="col-md-6">
          <div className="my-3">
            <label className="mb-2">Genres</label>
            <div className="d-flex gap-3 flex-wrap border rounded border-light p-3">
              {genres.map((genre) => (
                <div key={genre}>
                  <input
                    type="checkbox"
                    id={`genre-${genre}`}
                    name="genres"
                    value={genre}
                    onChange={() => handleGenreChange(genre)}
                    checked={formik.values.genres.includes(genre)}
                    className="btn-check"
                  />
                  <label htmlFor={`genre-${genre}`} className="btn">
                    {genre}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.genres && formik.errors.genres ? (
              <div className="text-danger">{formik.errors.genres}</div>
            ) : null}
          </div>
        </div>
      </div>
      <button
        type={loading ? "button" : "submit"}
        className="btn btn-light submit-btn"
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : submitType === "add"
          ? "Add Game"
          : "Update Game"}
      </button>
    </form>
  );
};

export default GameForm;
