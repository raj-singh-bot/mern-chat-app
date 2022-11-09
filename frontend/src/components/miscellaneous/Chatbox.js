import { Box } from "@chakra-ui/layout";
import { useSingleChat } from "../../store/singleChat/reducer";
// import "./styles.css";
import SingleChat from "./SingleChat";
// import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain} ) => {
  // const { selectedChat } = ChatState();
const { singleChat } = useSingleChat();
console.log(singleChat)
  return (
    <Box
      display={{ base: singleChat[0] ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;