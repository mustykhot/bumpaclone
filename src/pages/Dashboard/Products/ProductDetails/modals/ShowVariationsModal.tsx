import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { formatPrice } from "utils";
import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  variations: any[];
};

export const ShowVariationsModal = ({
  openModal,
  closeModal,
  variations,
}: Props) => {
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_show_variations">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title="Products Variations"
            >
              <div className="show_total_box">
                <p>
                  Total product variations: <span>{variations?.length}</span>{" "}
                </p>
              </div>
            </ModalRightTitle>

            <div className="single_related_product">
              {variations?.length ? (
                variations.map((item) => {
                  return (
                    <div key={item.id} className="related_product_flex">
                      <div className="left_container">
                        <img
                          src={
                            item.image
                              ? `${IMAGEURL}${item.image}`
                              : alt_image_url
                          }
                          alt="product"
                        />
                      </div>
                      <div className="right_container">
                        <div className="top">
                          <p className="name">{item.variant}</p>
                          <div className="price_container">
                            <p className="price">
                              {formatPrice(Number(item.price))}
                            </p>
                          </div>
                        </div>
                        <div className="bottom">
                          <p className="count">{item.stock} in Stock</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyResponse message="Prodcut does not have variations" />
              )}
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};
