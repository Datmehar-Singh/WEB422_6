import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, Button } from "react-bootstrap";
import Error from "next/error";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store.js";
import { addToFavourites, removeFromFavourites } from "../lib/userData";

const ArtworkCardDetail = ({ objectID }) => {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null
  );

  const favouritesClicked = () => {
    if (showAdded) {
      setFavouritesList((favouritesList) =>
        favouritesList.filter((fav) => fav != objectID)
      );
      setShowAdded(false);
    } else {
      setFavouritesList((current) => [...current, objectID]);
      setShowAdded(true);
    }
  };

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImage,
    title,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    artistWikidata_URL,
    creditLine,
    dimensions,
  } = data;

  return (
    <Card>
      {primaryImage && <Card.Img src={primaryImage} alt={title} />}

      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || "N/A"}
          <br />
          <strong>Classification:</strong> {classification || "N/A"}
          <br />
          <strong>Medium:</strong> {medium || "N/A"}
          <br />
          <br />
          <strong>Artist:</strong> {artistDisplayName || "N/A"}
          {artistDisplayName && artistWikidata_URL && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}
          <br />
          <strong>Credit Line:</strong> {creditLine || "N/A"}
          <br />
          <strong>Dimensions:</strong> {dimensions || "N/A"}
          <br />
          <br />
          {showAdded ? (
            <Button onClick={favouritesClicked} variant="primary">
              + Favourite (added)
            </Button>
          ) : (
            <Button onClick={favouritesClicked} variant="outline-primary">
              + Favourite
            </Button>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;
