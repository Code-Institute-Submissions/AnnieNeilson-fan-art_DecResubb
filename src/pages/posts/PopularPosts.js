import React, { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import styles from "../../styles/PopularPosts.module.css";
import { Accordion, Button, Container, Image } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContexts";

import Asset from "../../components/Assets";

import { Link } from "react-router-dom";

const PopularPosts = ({ mobile }) => {
  const [posts, setPosts] = useState({
    popularPosts: { results: [] },
  });
  const { popularPosts } = posts;
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const [isClicked, setIsClicked] = useState(false);
  const mobileStyle = {
    maxWidth: "90%",
    overflow: "hidden",
  };
  const divMobileStyles = {
    maxHeight: "180px",
    overflow: "hidden",
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?ordering=-likes_count`);
        setPosts((prevState) => ({
          ...prevState,
          popularPosts: data,
        }));
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    setIsClicked(true);
    setHasLoaded(false);
    const timer = setTimeout(() => {
      handleMount();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentUser]);

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      <Accordion>
        <h3>
          Popular Posts
          <Accordion.Toggle
            as={Button}
            variant="link"
            eventKey="0"
            className={styles.ToggleButton}
          >
            {" "}
            <i
              onClick={() => setIsClicked((prev) => !prev)}
              className={isClicked ? "fas fa-toggle-off" : "fas fa-toggle-on"}
            />
          </Accordion.Toggle>
        </h3>

        {hasLoaded ? (
          <>
            {popularPosts.results.length ? (
              <>
                {mobile ? (
                  <Accordion.Collapse
                    eventKey="0"
                    className="d-flex justify-content-around"

                  >
                    <div className="text-center">
                      {popularPosts.results.slice(0, 3).map((post) => (
                        <div className={appStyles.Content} key={post.id}>
                          <h4>{post.title}</h4>
                          <div style={divMobileStyles}>
                            <Link to={`/posts/${post.id}`}>
                              <Image style={mobileStyle} src={post.image} />
                            </Link>
                          </div>

                          <hr />

                          <Link to={`/profiles/${post.profile_id}`}>
                            <h5>{post.owner}</h5>
                          </Link>

                          {post.likes_count}
                          <i className={`fas fa-heart ${styles.Disabled} `} />
                        </div>
                      ))}
                    </div>
                  </Accordion.Collapse>
                ) : (
                  <Accordion.Collapse eventKey="0">
                    <div className="text-center">
                      {popularPosts.results.slice(0, 3).map((post) => (
                        <div className={appStyles.Content} key={post.id}>
                          <h4>{post.title}</h4>
                          <Link to={`/posts/${post.id}`}>
                            <Image
                              className={styles.ImagePreviews}
                              src={post.image}
                            />
                          </Link>
                          <hr />

                          <Link to={`/profiles/${post.profile_id}`}>
                            <h5>{post.owner}</h5>
                          </Link>

                          {post.likes_count}
                          <i className={`fas fa-heart ${styles.Disabled} `} />
                        </div>
                      ))}
                    </div>
                  </Accordion.Collapse>
                )}
              </>
            ) : (
              <Container className={appStyles.Content}>
                <p>No content</p>
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Accordion>
    </Container>
  );
};

export default PopularPosts;