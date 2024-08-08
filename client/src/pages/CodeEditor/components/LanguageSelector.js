import {
  Box,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FaJava, FaPython, FaJs, FaPhp } from "react-icons/fa";
import { SiTypescript, SiCsharp } from "react-icons/si";
import { Helmet } from "react-helmet";
import { LANGUAGE_VERSIONS } from "../constants";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <VStack spacing={4}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Helmet>
      {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
        <Tooltip key={lang} label={LANGUAGE_VERSIONS[lang]} placement="right">
          <IconButton
            aria-label={LANGUAGE_VERSIONS[lang]}
            icon={
              lang === "java" ? (
                <FaJava />
              ) : lang === "python" ? (
                <FaPython />
              ) : lang === "javascript" ? (
                <FaJs />
              ) : lang === "typescript" ? (
                <SiTypescript />
              ) : lang === "php" ? (
                <FaPhp />
              ) : lang === "csharp" ? (
                <SiCsharp />
              ) : null
            }
            size="lg"
            variant={language === lang ? "solid" : "outline"}
            colorScheme={language === lang ? "blue" : "gray"}
            onClick={() => onSelect(lang)}
          />
        </Tooltip>
      ))}
    </VStack>
  );
};

export default LanguageSelector;
