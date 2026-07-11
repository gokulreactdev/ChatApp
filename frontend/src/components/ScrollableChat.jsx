import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

const ScrollableChat = ({ messages, user }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, m, i, user._id)) && (
                <Tooltip.Root positioning={{ placement: "bottom-start" }}>
                  <Tooltip.Trigger asChild>
                    <Avatar.Root size="sm" mr={1} mt={1} cursor="pointer">
                      <Avatar.Fallback name={m.sender.name} />
                      <Avatar.Image
                        src={m.sender.pic || null}
                        alt={m.sender.name}
                      />
                    </Avatar.Root>
                  </Tooltip.Trigger>

                  <Tooltip.Positioner>
                    <Tooltip.Content>{m.sender.name}</Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              )}
              <span
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                  padding: "5px 15px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
