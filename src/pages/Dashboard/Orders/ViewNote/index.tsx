import { useState } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

import Button from "@mui/material/Button";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Toggle } from "components/Toggle";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import Loader from "components/Loader";
import MessageModal from "components/Modal/MessageModal";
import {
  useDeleteNoteMutation,
  useGetNotesQuery,
  useToggleNoteMutation,
} from "services";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import "./style.scss";
import { GrowthModal } from "components/GrowthModal";

type NoteModalProps = {
  openModal: boolean;
  closeModal: () => void;
};
const LoadingNoteBox = () => {
  return (
    <div className="single_loading_box">
      <div className="right_box">
        <div className="top_right_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
        <div className="bottom_right_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
      </div>
    </div>
  );
};
export const ViewNoteModal = ({ openModal, closeModal }: NoteModalProps) => {
  const navigate = useNavigate();
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetNotesQuery();
  const [selectedId, setSelectedId] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [toggleNote, { isLoading: loadToggle }] = useToggleNoteMutation();
  const [deleteNote, { isLoading: loadDelete }] = useDeleteNoteMutation();

  const onActivate = async (id: string) => {
    if (isSubscriptionExpired || isSubscriptionType !== "growth") {
      setOpenGrowthModal(true);
    } else {
      try {
        let result = await toggleNote(id);
        if ("data" in result) {
          showToast("Toggled successfully", "success");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const deleteNoteFnc = async () => {
    if (isSubscriptionExpired || isSubscriptionType !== "growth") {
      setOpenGrowthModal(true);
    } else {
      try {
        let result = await deleteNote(selectedId);
        if ("data" in result) {
          showToast("Deleted successfully", "success");
          setOpenDeleteModal(false);
          setSelectedId("");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <>
      {loadToggle && <Loader />}
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_view_invoice_modal_box">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className=""
              title="View Notes"
              extraChild={
                <Button
                  variant="outlined"
                  type="button"
                  startIcon={<PlusIcon stroke="#009444" />}
                  onClick={() => {
                    navigate("/dashboard/orders/create-note");
                  }}
                >
                  New Note
                </Button>
              }
            >
              <p className="note_explainer">
                This is the general note that’ll be displayed on all of your
                invoices. You can add multiple notes but can only use one at a
                time.
              </p>
            </ModalRightTitle>
            <div className="displayList">
              {!isError && !isLoading && !isFetching ? (
                data?.notes?.length ? (
                  data?.notes?.map((item) => {
                    return (
                      <div className="single_invoice_note">
                        <div className="note_title">
                          <p>{item.title}</p>
                          <div className="icon_flex">
                            <IconButton
                              onClick={() => {
                                navigate(
                                  `/dashboard/orders/edit-note/${item.id}`
                                );
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(`${item.id}`);
                                setOpenDeleteModal(true);
                              }}
                            >
                              <TrashIcon />
                            </IconButton>
                            <Toggle
                              handlelick={() => {
                                onActivate(`${item.id}`);
                              }}
                              toggled={item.active === 1 ? true : false}
                            />
                          </div>
                        </div>
                        <p className="note_description">
                          {parse(item.content)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <EmptyResponse message="No Notes Available" />
                )
              ) : (
                ""
              )}
              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => <LoadingNoteBox key={item} />)}
              {isError && <ErrorMsg error={"Something went wrong"} />}
            </div>
          </div>
        </div>
      </ModalRight>

      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              deleteNoteFnc();
            }}
            disabled={loadDelete}
            className="error"
          >
            {loadDelete ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete this note?"
      />

      <GrowthModal
        openModal={openGrowthModal}
        closeModal={() => {
          setOpenGrowthModal(false);
        }}
        title={`Improve Your Invoicing with Custom Notes`}
        subtitle={`Ideal for large businesses needing personalised communication on invoices.`}
        growthFeatures={[
          "Custom Messages: Add custom notes to your invoices for clear and effective communication with your customers.",
          "Flexible Note Management: Create and manage various notes for different needs, easily selecting the right note for each invoice.",
          "Improved Process: Simplify your invoicing and increase customer satisfaction with custom messaging.",
        ]}
        buttonText={`Upgrade to Growth`}
        eventName="invoice"
      />
    </>
  );
};
