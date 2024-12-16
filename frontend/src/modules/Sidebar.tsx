import { Layout, Button, List } from "antd";
import { MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { ChatConverstation } from "@/apis/message";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

const { Sider } = Layout;

interface SidebarProps {
  isOpen: boolean;
}

interface StyledListItemProps {
  $isActive: boolean;
}

const StyledListItem = styled(List.Item)<StyledListItemProps>`
  margin: 0.5rem;
  padding: 0.75rem;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  background: ${(props) =>
    props.$isActive ? "rgba(55, 65, 81, 1)" : "rgba(31, 41, 55, 0.4)"};

  &:hover {
    background: rgba(55, 65, 81, 0.6);
    transform: scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function Sidebar({ isOpen }: SidebarProps) {
  const {
    setCurrentConverstation,
    currentConverstation,
    setChatMessage,
    converstation,
  } = useAppContext();
  const handleChatClick = async (chat: ChatConverstation) => {
    setCurrentConverstation(chat);
  };

  const handleNewChat = () => {
    const newChat: ChatConverstation = {
      converstation_id: uuidv4(),
      summary: "New Chat",
    };

    setCurrentConverstation(newChat);
    setChatMessage([]);
  };

  return (
    <Sider
      width={256}
      collapsed={!isOpen}
      collapsedWidth={0}
      className="bg-gray-900 h-full overflow-auto"
      theme="dark"
    >
      {isOpen && (
        <div className="p-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            data-wave="false"
            block
            size="large"
            onClick={handleNewChat}
            className="mb-4 transition-opacity duration-200"
          >
            New Chat
          </Button>

          <List
            dataSource={converstation}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            locale={{
              emptyText: <span className="text-white">No Data</span>,
            }}
            renderItem={(chat: ChatConverstation) => {
              return (
                <StyledListItem
                  key={chat.converstation_id}
                  onClick={() => handleChatClick(chat)}
                  $isActive={
                    currentConverstation?.converstation_id ===
                    chat.converstation_id
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <MessageOutlined className="text-white text-lg mt-1 transition-opacity duration-200" />
                    }
                    title={
                      <span className="text-white font-medium hover:text-gray-300">
                        {chat.summary}
                      </span>
                    }
                    description={
                      <span className="text-white text-sm">
                        {chat.created_at
                          ? new Date(chat.created_at).toLocaleDateString()
                          : "Unknown Date"}
                      </span>
                    }
                    className="items-center"
                  />
                </StyledListItem>
              );
            }}
          />
        </div>
      )}
    </Sider>
  );
}
