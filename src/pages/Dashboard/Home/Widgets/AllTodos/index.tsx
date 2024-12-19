import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Skeleton } from "@mui/material";
import { ChevronRight } from "assets/Icons/ChevronRight";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";
import { TodosType } from "services/api.types";
import "./style.scss";

type TodosProps = {
  openModal: boolean;
  closeModal: () => void;
  todos?: TodosType[];
  getTodoIconAndLink: any;
  refreshFnc: any;
  isLoading: boolean;
};

export const AllTodosModal = ({
  openModal,
  closeModal,
  todos,
  getTodoIconAndLink,
  refreshFnc,
  isLoading,
}: TodosProps) => {
  const navigate = useNavigate();
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_view_todos">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
            >
              <div className="not_header">
                <div className="title">
                  <p className="header">Todos</p>
                </div>
                <IconButton
                  onClick={() => {
                    refreshFnc();
                  }}
                  className="refresh"
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </ModalRightTitle>

            <div className="all_todos_list">
              {isLoading &&
                new Array(10).fill(1).map((_, i) => {
                  return <Skeleton animation="wave" key={i} width={"100%"} />;
                })}
              {todos && todos?.length && !isLoading
                ? todos.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          navigate(`${getTodoIconAndLink(item, "link")}`);
                        }}
                        className="todo_item"
                      >
                        <div className="text_section">
                          <div className={`icon_box ${item.action.domain}`}>
                            {getTodoIconAndLink(item, "icon")}
                          </div>
                          <p>{item.label}</p>
                        </div>
                        <ChevronRight />
                      </div>
                    );
                  })
                : ""}
              {todos && !todos?.length && !isLoading ? (
                <EmptyResponse message="Empty Record" />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
