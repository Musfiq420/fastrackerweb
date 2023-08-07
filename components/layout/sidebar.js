import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-grid-system";
import styled from "@emotion/styled";
import { AiFillFolder, AiFillFolderOpen, AiOutlineFile } from "react-icons/ai";


const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.isOpen ? "0" : "15%")};
  height: 100%;
  width: ${(props) => (props.isOpen ? "15%" : "0")};
  background-color: #f2fff6;
  z-index: 2000;
  transition: left 0.3s ease-in-out, width 0.3s ease-in-out;

  @media (max-width: 768px) {
    left: ${(props) => (props.isMenuOpen ? "0" : "-100%")};
    width: 100%;
  }
`;

const SidebarHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
`;

const Heading = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #0c9c00;
  padding: 10px;
`;

const OptionContainer = styled.div`
  padding-left: ${(props) => (props.level ? props.level * 15 : 0)}px;
  display: flex;
  align-items: center;
`;

const OptionText = styled.div`
display: flex;
  color: ${(props) => (props.isSelected ? "#0C9C00" : "gray")};
  width: 100%;
  background-color: ${(props) =>
    props.isSelected ? "#D8F5D6" : "transparent"};
  padding: 10px;
  cursor: pointer;
  border-right: ${(props) => (props.isSelected ? "6px solid #12E100" : "none")};
  margin: 0;
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: smaller;
  margin-right: 5px;
  cursor: pointer;
`;

const FloatingActionButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: #D8F5D6;
  color: #0C9C00;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 2500;
  display: none; /* Hide by default for larger screens */

  @media (max-width: 768px) {
    display: block; /* Show for smaller screens */
    left: ${(props) => (props.isMenuOpen ? "80%" : "none")};
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  // const [expandedOptions, setExpandedOptions] = useState([]);
  const router = useRouter();

  if(router.pathname=="/")
   return <></>

  useEffect(() => {

    // console.log(router.pathname.slice(1).charAt(0).toUpperCase() + router.pathname.slice(2));
    setSelectedOption(router.pathname.slice(1).charAt(0).toUpperCase() + router.pathname.slice(2))
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set the initial state and add resize event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsMenuOpen(false); // Close the menu after an option is selected
    setIsOpen(true); // Open the sidebar on option selection
    // Use the router to navigate to the corresponding page
    router.push(`/${option.toLowerCase().replace(" ", "-")}`);
  };

  // const handleExpandClick = (option) => {
  //   if (expandedOptions.includes(option)) {
  //     setExpandedOptions(expandedOptions.filter((opt) => opt !== option));
  //   } else {
  //     setExpandedOptions([...expandedOptions, option]);
  //   }
  // };

  // const isOptionExpanded = (option) => expandedOptions.includes(option);

  const renderOptions = (options, level = 0) => {
    return options.map((option) => (
      <div key={option.text}>
        <OptionContainer level={level}>
          
          <OptionText
            isSelected={selectedOption === option.text}
            // onClick={() => option.children?handleExpandClick(option.text):handleOptionClick(option.text)}
            onClick={() => option.children?null:handleOptionClick(option.text)}
          >
            {option.children? (
            <ExpandIcon 
            // onClick={() => handleExpandClick(option.text)}
            >
              <AiFillFolderOpen />
              {/* {isOptionExpanded(option.text) ? (
                // <MdOutlineArrowDropDown />
                <AiFillFolderOpen />
              ) : (
                // <MdOutlineArrowRight />
                <AiFillFolder />
              )} */}
            </ExpandIcon>
          ): 
          <ExpandIcon>
            <AiOutlineFile />
          </ExpandIcon>
          
          
          
          }
            {option.text}
          </OptionText>
        </OptionContainer>
        {/* {isOptionExpanded(option.text) && */}
          {option.children &&
          renderOptions(option.children, level + 1)}
      </div>
    ));
  };

  const options = [
    {
      text: "Dashboard",
    },
    {
      text: "Sewing Dept",
      children: [
        { text: "Production" },
        { text: "Trend Analysis" },
        { text: "Real Time" },
        { text: "Capacity Analysis" },
      ],
    },
    {
      text: "Maintenance Dept",
      children: [
        { text: "Machine Breakdown" },
      ],
    },
    
    {
      text: "Tracking",
    },
    {
      text: "QMS",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  

  return (
    <>
      {isMobile && (
        <FloatingActionButton onClick={toggleMenu} isMenuOpen={isMenuOpen}>
          {isMenuOpen ? "X" : "|||"}
        </FloatingActionButton>
      )}
      <SidebarContainer isOpen={isOpen} isMenuOpen={isMenuOpen}>
        <SidebarHeaderContainer>
        <img src="/fastracker-icon-2.png" height={40} width={40}/>
          <Heading>Fastracker</Heading>
        </SidebarHeaderContainer>
        <Container>
          <Row>
            <Col style={{ padding: 0 }}>{renderOptions(options)}</Col>
          </Row>
        </Container>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
