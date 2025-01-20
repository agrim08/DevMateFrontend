import { useParams } from "react-router-dom";

const Chat = () => {
  const { targetUserId } = useParams();
  console.log(targetUserId);
  return <div>Hii</div>;
};

export default Chat;
