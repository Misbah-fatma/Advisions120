import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  HStack
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import axios from "axios";
import Sidebar from "../SideBar";
import { Helmet } from "react-helmet";
import "../style.css";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [userData, setUserData] = useState(null);
  const [output, setOutput] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.50");
  const buttonColor = useColorModeValue("blue.500", "blue.200");

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
      fetchSavedCode(JSON.parse(userDataFromStorage)._id);
    }
  }, []);

  const userId = userData ? userData._id : null;
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  const fetchSavedCode = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/code`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        }
      );
      const savedCode = response.data.code;
      if (savedCode) {
        setCode(savedCode.code);
        setLanguage(savedCode.language);
        setOutput(savedCode.output);
      }
    } catch (error) {
      console.error("Error fetching saved code:", error);
    }
  };

  const onSave = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/save",
        { language, code, output, userId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        }
      );
      if (response.data.success) {
        alert("Code saved successfully!");
      } else {
        alert("Error occurred while saving code");
      }
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Error occurred while saving code");
    }
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const onSelect = (language) => {
    setLanguage(language);
    setCode(CODE_SNIPPETS[language]);
  };

  const handleFileClick = (codeSaved) => {
    setCode(codeSaved.code);
    setLanguage(codeSaved.language);
    setOutput(codeSaved.output);
  };

  return (
    <>
      <Helmet>
        <title>Advisions LMS</title>
        <meta name="description" content="Learning Management System" />
        <meta name="keywords" content="Advisions, LMS" />
      </Helmet>
      {isMobile ? (
        <Tabs isFitted variant="enclosed" height="100vh" colorScheme="blue">
          <TabList>
            <Tab>Code</Tab>
            <Tab>Output</Tab>
            <Tab>Sidebar</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box width="100%" height="80vh" display="flex" flexDirection="column" bg={bgColor}>
                <Box display="flex" justifyContent="space-between" mb={4}>
                  <LanguageSelector language={language} onSelect={onSelect} />
                  <Button colorScheme="blue" onClick={onSave}>Save</Button>
                </Box>
                <Box flex="1">
                  <Editor
                    options={{
                      minimap: {
                        enabled: false,
                      },
                    }}
                    theme={colorMode === "light" ? "vs-light" : "vs-dark"}
                    language={language}
                    defaultValue={CODE_SNIPPETS[language]}
                    onMount={onMount}
                    value={code}
                    onChange={(value) => setCode(value)}
                    height="100%"
                  />
                </Box>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                width="100%"
                height="80vh"
                color={textColor}
                p={4}
                borderRadius="md"
                overflowY="scroll"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}
              >
                <Output editorRef={editorRef} language={language} output={output} setOutput={setOutput} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box width="100%" height="80vh" overflowY="auto" bg={bgColor}>
                <Sidebar onFileClick={handleFileClick} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Box height="100vh" display="flex" bg={bgColor}>
          <Box width="100%" height="100%" display="flex" flexDirection="column" color={textColor}>
            <HStack justifyContent="space-between" mb={4}>
              <LanguageSelector language={language} onSelect={onSelect} />
              <Button colorScheme="blue" onClick={onSave}>Save</Button>
              <Button colorScheme="blue" onClick={onOpen}>Open Sidebar</Button>
            </HStack>
            <Box display="flex" flex="1" overflow="hidden">
              <Box flex="1" overflow="hidden">
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  theme={colorMode === "light" ? "vs-light" : "vs-dark"}
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={code}
                  onChange={(value) => setCode(value)}
                  height="100%"
                />
              </Box>
              <Box
                width="30%"
                ml={4}
                color={textColor}
                p={4}
                overflowY="scroll"
                borderLeft="1px solid"
                borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}
              >
                <Output editorRef={editorRef} language={language} output={output} setOutput={setOutput} />
              </Box>
            </Box>
          </Box>
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Sidebar</DrawerHeader>
              <DrawerBody>
                <Sidebar onFileClick={handleFileClick} />
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      )}
    </>
  );
};

export default CodeEditor;
