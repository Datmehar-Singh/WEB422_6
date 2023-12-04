import React, { useState, useEffect } from "react";
import { Col, Row, Container, Pagination, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import ArtworkCard from "../../components/ArtworkCard";
import validObjectIDList from "../../public/data/validObjectIDList.json";

const PER_PAGE = 12;

export default function ArtHome() {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.asPath);
  const queryParam = searchParams.get("q");
  let finalQuery = queryParam;

  let [artworkList, setArtworkList] = useState(null);
  let [page, setPage] = useState(1);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${finalQuery}`
  );

  useEffect(() => {
    console.log("Artwork List:", artworkList);
  }, [artworkList]);

  useEffect(() => {
    if (data != null && data != undefined) {
      let validResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );
      let results = [];
      for (let i = 0; i < validResults.length; i += PER_PAGE) {
        const chunk = validResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (!artworkList) {
    return null;
  }

  if (error) {
    return <Error statusCode={404} />;
  }

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <Container>
        {artworkList.length > 0 ? (
          <>
            <Row className="gy-4">
              {artworkList[page - 1].map((currentObjectID) => (
                <Col lg={3} key={currentObjectID}>
                  <ArtworkCard objectID={currentObjectID} />
                </Col>
              ))}
            </Row>
            <Row>
              <Col>
                <br />
                <br />
                <Pagination>
                  <Pagination.Prev onClick={previousPage} />
                  <Pagination.Item>{page}</Pagination.Item>
                  <Pagination.Next onClick={nextPage} />
                </Pagination>
              </Col>
            </Row>
          </>
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              <p>Try searching for something else.</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
