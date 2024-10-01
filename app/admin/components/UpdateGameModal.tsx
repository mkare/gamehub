"use client";
import { useState, useEffect } from "react";
import UpdateGame from "@/app/admin/components/UpdateGame";
import { Game } from "@/types/game";

const backDrop = `<div class="modal-backdrop fade show"></div>`;

const UpdateModal = ({ game }: { game: Game }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0";
      document.body.classList.add("modal-open");
      document.body.insertAdjacentHTML("beforeend", backDrop);
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
      document.body.classList.remove("modal-open");
      document.body.querySelector(".modal-backdrop")?.remove();
    }
  }, [showModal]);

  const handleSubmit = () => {
    setShowModal(false);
  };

  return (
    <div className="ms-auto">
      <button
        className="btn btn-sm btn-outline-info"
        onClick={() => setShowModal(true)}
      >
        Update
      </button>
      {showModal && (
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          tabIndex={-1}
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-xl-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {game ? game.name : "Update Game"}
                </h5>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <UpdateGame game={game} onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateModal;
