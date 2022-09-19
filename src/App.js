import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Select, Alert } from "antd";
import "antd/dist/antd.css";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { db } from "./firebase";
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  collection,
  Timestamp,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import "./App.css";
import TwitterIcon from "./icons/twitter";

const NUMBER_OF_QUESTIONS = 3;

const auth = getAuth();

const { TextArea } = Input;

const q = query(
  collection(db, "questions"),
  where(
    "date",
    "==",
    format(new Date(Timestamp.now().toMillis()), "yyyy-MM-dd")
  )
);

function App() {
  const isMobile = window.innerWidth < 1050;

  const { text } = useTypewriter({
    words: ["Sciences", "History", "Arts", "News", "Anything else 😁"].map(
      (value) => `${value} ?`
    ),
    loop: 0,
  });

  const [isDisabled, setIsDisabled] = useState(false);

  const addQuestion = async (question) => {
    await addDoc(collection(db, "questions"), {
      ...question,
      date: format(Timestamp.now().toMillis(), "yyyy-MM-dd"),
    });
  };

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length >= NUMBER_OF_QUESTIONS) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundImage: `url('/library.jpeg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {isDisabled && (
        <Alert
          style={{ textAlign: "center" }}
          message={`The ${NUMBER_OF_QUESTIONS} questions of the day were already submitted by other users ! Try to submit your questions tomorrow ! 😉`}
          type="info"
        />
      )}
      <div
        style={{
          backgroundColor: "black",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          opacity: 0.6,
        }}
      />
      <Row
        style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}
      >
        <Col
          span={isMobile ? 24 : 13}
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              height: isMobile ? 300 : "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // filter: "brightness(0.5)",
              padding: isMobile ? 20 : 80,
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: isMobile ? 37 : 80,
                zIndex: 1,
                fontFamily: "Piedra",
                textShadow: "10px 10px 20px black",
              }}
            >
              <div>Something to share about </div>
              <div
                style={{
                  color: "#008037",
                  fontWeight: "bold",
                }}
              >
                {text}
                <Cursor cursorStyle="_" />
              </div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontSize: isMobile ? 18 : 35,
                  marginTop: isMobile ? 20 : 60,
                }}
              >
                Enter a question with some answer options and submit it. Your
                question will be asked as a game session by the Twitter bot{" "}
                <span style={{ color: "#008037", fontWeight: "bold" }}>
                  @kulturbot
                </span>{" "}
                !
              </div>
            </div>
          </div>
        </Col>
        <Col
          span={isMobile ? 24 : 11}
          style={{
            position: "relative",
            padding: isMobile ? 30 : "20px 110px 20px 110px",
            // backgroundColor: "#00803709",
            fontFamily: "Roboto",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              boxShadow: "rgba(0, 0, 0, 0.5) 3px 3px 6px 2px",
              padding: isMobile ? 30 : "15px 40px 15px 40px",
              borderRadius: 30,
              opacity: 0.93,
            }}
          >
            <img
              style={{
                width: 200,
              }}
              src="/kultur.png"
              alt="kultur"
            />

            <div
              style={{
                width: "100%",
              }}
            >
              <Form
                disabled={isDisabled}
                layout="vertical"
                onFinish={async (values) => {
                  if (
                    !values.question ||
                    !values.prop1 ||
                    !values.prop2 ||
                    !values.prop3 ||
                    !values.prop4 ||
                    !values.answer
                  ) {
                    message.error("You must fill all the fields ! :)");
                  } else {
                    try {
                      const result = await signInWithPopup(
                        auth,
                        new TwitterAuthProvider()
                      );
                      const info = getAdditionalUserInfo(result);
                      try {
                        await addQuestion({
                          ...values,
                          username: info.username,
                        });
                        message.success(
                          "Your question was succesfully saved !"
                        );
                      } catch (error) {
                        console.log(error);
                        message.error(
                          "Unfortunately, we could not save your question"
                        );
                      }
                    } catch (error) {
                      message.error(
                        "Unfortunately, we could not login to Twitter"
                      );
                    }
                  }
                }}
              >
                <Form.Item
                  label="Enter your question"
                  name={"question"}
                  required
                >
                  <TextArea
                    rows={3}
                    maxLength={130}
                    required
                    placeholder="130 characters max"
                  />
                </Form.Item>
                <Form.Item
                  label="The first proposition"
                  name={"prop1"}
                  required
                >
                  <Input
                    maxLength={47}
                    required
                    placeholder="47 characters max"
                  />
                </Form.Item>
                <Form.Item
                  label="The second proposition"
                  name={"prop2"}
                  required
                >
                  <Input
                    maxLength={47}
                    required
                    placeholder="47 characters max"
                  />
                </Form.Item>
                <Form.Item
                  label="The third proposition"
                  name={"prop3"}
                  required
                >
                  <Input
                    maxLength={47}
                    required
                    placeholder="47 characters max"
                  />
                </Form.Item>
                <Form.Item
                  label="The fourth proposition"
                  name={"prop4"}
                  required
                >
                  <Input
                    maxLength={47}
                    required
                    placeholder="47 characters max"
                  />
                </Form.Item>
                <Form.Item label="The answer number" name={"answer"} required>
                  <Select dropdownStyle={{ borderRadius: 7 }} required>
                    <Select.Option value={1}>
                      The first proposition
                    </Select.Option>
                    <Select.Option value={2}>
                      The second proposition
                    </Select.Option>
                    <Select.Option value={3}>
                      The third proposition
                    </Select.Option>
                    <Select.Option value={4}>
                      The fourth proposition
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{
                      width: "100%",
                      height: 50,
                      borderRadius: 25,
                      marginTop: 5,
                    }}
                    htmlType="submit"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TwitterIcon style={{ width: 30, marginRight: 10 }} />
                      <span>Submit with Twitter</span>
                    </div>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
