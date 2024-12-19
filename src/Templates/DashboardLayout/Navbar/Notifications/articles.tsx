import article from "assets/images/article.png";
import { Chip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { addToArticles, selectArticles } from "store/slice/NotificationSlice";
import EmptyResponse from "components/EmptyResponse";
import { useEffect, useState } from "react";
import { client } from "utils/constants/general";
import speaker from "assets/images/speaker.png";

import moment from "moment";
import { Skeleton } from "@mui/material";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";

export const LoadingNotificationBox = () => {
  return (
    <div className="single_loading_notification_box">
      <div className="top_box">
        <Skeleton animation="wave" width={"100%"} height={"100%"} />
      </div>
      <div className="bottom_box">
        <div className="bottom_top_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
        <div className="bottom_bottom_box">
          <Skeleton animation="wave" width={"100%"} height={20} />
        </div>
      </div>
    </div>
  );
};

export const Articles = () => {
  const articles = useAppSelector(selectArticles);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [displayedBlogList, setDisplayedBlogList] = useState<any[]>([]);

  const handleSearch = (value: string) => {
    if (value) {
      const searchedList = articles.filter((item: any) => {
        return item.fields.title.toLowerCase().includes(value.toLowerCase());
      });
      setDisplayedBlogList(searchedList);
    } else {
      setDisplayedBlogList(articles);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const res = await client.getEntries({ content_type: "blogPost" });
        const blogs = res.items;
        if (blogs && blogs.length) {
          dispatch(addToArticles(blogs));
        } else {
          dispatch(addToArticles([]));
        }
        setIsLoading(false);
      } catch (error) {
        dispatch(addToArticles([]));
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    setDisplayedBlogList(articles);
  }, [articles]);

  return (
    <>
      <div className="update_search_box">
        <div className="search_container">
          <InputField
            type={"text"}
            containerClass="search_field"
            value={search}
            onChange={(e: any) => {
              setSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search"
            suffix={<SearchIcon />}
          />
        </div>
      </div>

      {isLoading ? (
        [1, 2, 3, 4].map((i) => <LoadingNotificationBox key={i} />)
      ) : displayedBlogList.length ? (
        displayedBlogList.map((item) => (
          <div
            key={item.sys.id}
            className="single_news"
            onClick={() => {
              window.open(
                `https://www.getbumpa.com/blog/${item.fields.slug}`,
                "_blank"
              );
            }}
          >
            <div
              className="image_box"
              style={{
                backgroundImage: `url(${item.fields.thumbnail.fields.file.url})`,
              }}
            ></div>
            <p className="title">{item.fields.title}</p>
            <div className="date_box">
              <p className="date">{moment(item.sys.createdAt).format("ll")}</p>
              <Chip color="info" label={item.fields.tags[0]} />
            </div>
          </div>
        ))
      ) : (
        <EmptyResponse
          message="There are no updates available"
          image={speaker}
        />
      )}
    </>
  );
};
