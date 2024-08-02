import {
  Box,
  IconButton,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { FaJava, FaPython, FaJs, FaPhp } from "react-icons/fa";
import { SiTypescript, SiCsharp } from "react-icons/si";
import { Helmet } from "react-helmet";
import { LANGUAGE_VERSIONS } from "../constants";

const ICONS = {
  javascript: FaJs,
  typescript: SiTypescript,
  python: FaPython,
  java: FaJava,
  csharp: SiCsharp,
  php: FaPhp,
};

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <>
      <Helmet>
        <title>Advisions LMS</title>
        <meta name="description" content="Learning Management System" />
        <meta name="keywords" content="Advisions, LMS" />
      </Helmet>
      <Box ml={2} mb={4}>
        <HStack spacing={2} alignItems="center">
          {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => {
            const Icon = ICONS[lang];
            return (
              <Tooltip
                key={lang}
                label={`${lang} (${version})`}
                aria-label={`${lang} (${version})`}
              >
                <IconButton
                  icon={<Icon />}
                  aria-label={lang}
                  onClick={() => onSelect(lang)}
                  colorScheme={lang === language ? "blue" : "gray"}
                  size="lg"
                />
              </Tooltip>
            );
          })}
        </HStack>
      </Box>
    </>
  );
};

export default LanguageSelector;
