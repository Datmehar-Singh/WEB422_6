import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store.js";
import { addToHistory } from "../lib/userData.js";
import { Form } from "react-bootstrap";
import Row from "react-bootstrap";
import Col from "react-bootstrap";
import Button from "react-bootstrap";
export default function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchQuery: "",
      searchBy: "",
      geoLocation: "",
      medium: "",
      isOnView: false,
      isHighlight: false,
    },
  });

  const submitForm = async (data) =>{
    let queryString = "";
    queryString += `${encodeURIComponent(data.searchBy) || "title"}=${true}`;
    queryString += data.geoLocation
      ? `&geoLocation=${encodeURIComponent(data.geoLocation)}`
      : "";
    queryString += data.medium
      ? `&medium=${encodeURIComponent(data.medium)}`
      : "";
    queryString += `&isOnView=${data.isOnView || false}`;
    queryString += `&isHighlight=${data.isHighlight || false}`;
    queryString += `&q=${encodeURIComponent(data.searchQuery)}`;
    setSearchHistory((searchHistory) => [...searchHistory, queryString]);
    await addToHistory(queryString);
    router.push(`/artwork?${queryString}`);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="q"
              {...register("searchQuery", { required: true })}
            />
            {errors.searchQuery?.type === "required" && (
              <span className="is-invalid">This field is required.</span>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label className="form-label">Search By</Form.Label>
          <Form.Select name="searchBy" {...register("searchBy")}>
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="geoLocation"
              {...register("geoLocation")}
            />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;,
              &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.),
              with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Medium</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="medium"
              {...register("medium")}
            />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;,
              &quot;Furniture&quot;, &quot;Paintings&quot;,
              &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple
              values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            className="form-label"
            type="checkbox"
            label="Highlighted"
            name="isHighlight"
            {...register("isHighlight")}
          />
          <Form.Check
            className="form-label"
            type="checkbox"
            label="Currently on View"
            name="isOnView"
            {...register("isOnView")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
