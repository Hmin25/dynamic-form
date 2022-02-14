import {
  Center,
  Text,
  Radio,
  RadioGroup,
  Input,
  Button,
  Textarea,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import { setConstantValue } from "typescript";

function App() {
  const [allData, setAllData] = useState<[]>();
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);
  const [dataObject, setDataObject] = useState({});
  const [arrayToDisplay, setArrayToDisplay] = useState();

  const [value, setValue] = useState();

  useEffect(() => {
    async function getFormData() {
      await Axios.get(`https://ulventech-react-exam.netlify.app/api/form`)
        .catch((err) => {
          console.log(err);
        })
        .then((res: any) => {
          // console.log(res.data.data);
          setAllData(res.data.data);
        });
    }
    getFormData();
  }, []);


  useEffect(() => {
    if (allData && allData.length > 0) {
      let temporaryObject: any = {};
      let array: any = [];

      allData.forEach(function (data: any, index) {
        temporaryObject[data.fieldName] = data.value;

        switch (data.type) {
          case "email":
            return array.push(
              <HStack w="40vw" justifyContent="space-between">
                <Text>{data.fieldName}:</Text>
                <Input
                  textAlign="center"
                  id={data.fieldName}
                  w="300px"
                  type="email"
                  borderRadius="5px"
                  defaultValue={data.value}
                  onChange={(e) => {
                    let newObject: any = {};
                    newObject[data.fieldName] = e.target.value;
                    temporaryObject = { ...temporaryObject, ...newObject };
                    setDataObject(temporaryObject)
                  }}
                ></Input>
              </HStack>
            );
          case "text":
            return array.push(
              <HStack w="40vw" justifyContent="space-between">
                <Text>{data.fieldName}:</Text>
                <Input
                  textAlign="center"
                  id={data.fieldName}
                  w="300px"
                  type="text"
                  borderRadius="5px"
                  defaultValue={data.value}
                  onChange={(e) => {
                    let newObject: any = {};
                    newObject[data.fieldName] = e.target.value;
                    temporaryObject = { ...temporaryObject, ...newObject };
                    setDataObject(temporaryObject)
                  }}
                ></Input>
              </HStack>
            );
          case "number":
            return array.push(
              <HStack w="40vw" justifyContent="space-between">
                <Text>{data.fieldName}:</Text>
                <Input
                  textAlign="center"
                  w="300px"
                  type="number"
                  borderRadius="5px"
                  defaultValue={data.value}
                  onChange={(e) => {
                    let newObject: any = {};
                    newObject[data.fieldName] = e.target.value;
                    temporaryObject = { ...temporaryObject, ...newObject };
                    setDataObject(temporaryObject)
                  }}
                ></Input>
              </HStack>
            );
          case "select":
            return array.push(
              <HStack w="40vw" justifyContent="space-between">
                <Text>{data.fieldName}:</Text>
                <RadioGroup
                  onChange={(e: any) => {
                    setValue(e);
                    let newObject: any = {};
                    newObject[data.fieldName] = e;
                    temporaryObject = { ...temporaryObject, ...newObject };
                    setDataObject(temporaryObject)
                  }}
                  defaultValue={data.value}
                >
                  <Stack direction="row">
                    <Radio value={data.options[0]} >{data.options[0]}</Radio>
                    <Radio value={data.options[1]} >{data.options[1]}</Radio>
                    <Radio value={data.options[2]} >{data.options[2]}</Radio>
                  </Stack>
                </RadioGroup>
              </HStack>
            );
          case "multiline":
            return array.push(
              <HStack w="40vw" justifyContent="space-between">
                <Text>{data.fieldName}:</Text>
                <Textarea
                  w="300px"
                  borderRadius="5px"
                  size="md"
                  defaultValue={data.value}
                  onChange={(e) => {
                    let newObject: any = {};
                    newObject[data.fieldName] = e.target.value;
                    temporaryObject = { ...temporaryObject, ...newObject };
                    setDataObject(temporaryObject)
                  }}
                />
              </HStack>
            );
        }
        // return setArrayToDisplay(array);
        return array;
      });
      setDataObject(temporaryObject);
      setArrayToDisplay(array);
    }
  }, [allData]);
  

  useEffect(() => {
    if (allData) {

      let getFirstNameInputValue: string = (document.getElementById("firstName") as HTMLInputElement).value;
      let getLastNameInputValue: string = (document.getElementById("lastName") as HTMLInputElement).value;
      let getEmailInputValue: string = (document.getElementById("emailAddress") as HTMLInputElement).value;

      if (
        getFirstNameInputValue != "" &&
        getLastNameInputValue != "" &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(getEmailInputValue) === true
      ) {
        setIsSubmitEnabled(true);
      } else {
        setIsSubmitEnabled(false);
      }
    }
  }, [dataObject]);


  async function postFormData() {
    await Axios.post(
      `https://ulventech-react-exam.netlify.app/api/form`,
      dataObject
    )
      .then((res) => {
        console.log(res.data);
        setPostMessage(res.data.message);
        setSubmitStatus(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Center w="100vw" h="20vh">
        <Text fontWeight="500" fontSize="1.3rem">
          Dynamic Form
        </Text>
      </Center>
      <Center
        w="100vw"
        h="fit-content"
        display="flex"
        flexDir="column"
        rowGap={5}
      >
        {submitStatus === false ? (
          <>
            {allData && arrayToDisplay}

            {isSubmitEnabled === true ? (
              <Button
                type="submit"
                bgColor="green.500"
                color="white"
                fontSize="0.9rem"
                w="200px"
                _hover={{ color: "white", bgColor: "green.300" }}
                onClick={() => {
                  postFormData();
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                type="submit"
                bgColor="green.500"
                color="white"
                fontSize="0.9rem"
                w="200px"
                isDisabled
                _hover={{ color: "white" }}
              >
                Submit
              </Button>
            )}
          </>
        ) : (
          <Center>
            <Text fontSize="1.8rem" fontWeight="500" color="green.400">
              {postMessage}
            </Text>
          </Center>
        )}
      </Center>
    </>
  );
}

export default App;
