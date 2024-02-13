import { AddComment, Chat, GitHub } from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  SxProps,
  Typography,
} from "@mui/material";
import moment from "moment-timezone";
import { Session } from "next-auth";

const textSx: SxProps = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "clip",
  userSelect: "none",
  msUserSelect: "none",
  msTouchSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  //
};

const SidebarSx = {
  item: {
    sx: {
      ":hover": {
        backgroundColor: "rgb(240,240,240)",
      },
      paddingLeft: "1rem",
    },
    box: {
      cursor: "pointer",
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    date: {
      ...textSx,
      marginLeft: "auto",
      textAlign: "right",
    },
    modelName: {
      ...textSx,
      color: "rgb(100,100,100)",
    },
    title: {
      ...textSx,
    },
    lastMessage: {
      ...textSx,
      color: "rgb(100,100,100)",
    },
    button: {
      ...textSx,
      textAlign: "center",
      variant: "body1",
      paddingLeft: "1rem",
      fontWeight: "bold",
      fontSize: "larger",
      marginBlock: "0.5rem",
    },
  },
} as const satisfies Record<string, SxProps | Record<string, SxProps>>;

function formatDate(date: Date): String {
  return moment(date).format("MMM D");
}

type SessionInfo = {
  modelName: string;
  date: Date;
  title: string;
  lastMessage: string;
};

type ButtonInfo = {
  label: string;
  link?: string;
  trigger?: () => unknown;
  icon?: JSX.Element;
};

function SessionItem({ modelName, date, title, lastMessage }: SessionInfo) {
  return (
    <Box sx={SidebarSx.item.box}>
      <Box width={"100%"} maxWidth={"95%"}>
        <Grid container width={"100%"}>
          <Grid item xs={8}>
            <Typography variant="body2" sx={SidebarSx.item.modelName}>
              {modelName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ ...SidebarSx.item.date }}>
              {formatDate(date)}
            </Typography>
          </Grid>
        </Grid>
        {/*  */}
        <Typography variant="h6" sx={SidebarSx.item.title}>
          {title}
        </Typography>
        <Typography variant="body1" sx={SidebarSx.item.lastMessage}>
          {lastMessage}
        </Typography>
      </Box>
      <Box>
        <ArrowForwardIosIcon
          htmlColor={"gray"}
          style={{ fontSize: "smaller" }}
        />
      </Box>
    </Box>
  );
}

function ListButton(props: ButtonInfo) {
  return (
    <Box display={"flex"} alignItems={"center"} width={"100%"}>
      {props.icon}
      <Typography sx={SidebarSx.item.button}>{props.label}</Typography>
    </Box>
  );
}

function SessionItemList(sessions: SessionInfo[]) {
  const len = sessions.length;
  return sessions.map(({ modelName, date, title, lastMessage }, i) => (
    <div key={`session-list-item-${modelName}-${title}-${i}`}>
      <ListItem sx={SidebarSx.item.sx}>
        <SessionItem
          modelName={modelName}
          date={date}
          lastMessage={lastMessage}
          title={title}
        />
        <Divider variant="middle" />
      </ListItem>
      {i !== len - 1 && <Divider variant="middle" />}
    </div>
  ));
}

function ItemButtonList(links: ButtonInfo[]) {
  const len = links.length;
  return links.map(({ label, link, icon }, i) => (
    <div key={`item-button-${label}-${i}`}>
      <ListItem sx={SidebarSx.item.sx}>
        <ListButton label={label} link={link} icon={icon} />
      </ListItem>
      {i !== len - 1 && <Divider variant="middle" />}
    </div>
  ));
}

export function ChatSideBar() {
  return (
    <>
      <List sx={{ marginTop: "2rem" }}>
        <Divider />
        {SessionItemList(
          [...Array(5)].map(() => ({
            modelName: "tinyLlama",
            date: new Date(),
            title: "Title",
            lastMessage:
              "Last Messageasdasda asd asd asd asasdasd asd asd asd  d",
          })),
        )}
        <Divider />
      </List>
      <List sx={{ marginTop: "auto", marginBottom: "2rem" }}>
        <Divider />
        {ItemButtonList([
          { label: "All Chat", icon: <Chat /> },
          { label: "New Chat", icon: <AddComment /> },
          { label: "Github", link: "/chat/sessions/new", icon: <GitHub /> },
        ])}
        <Divider />
      </List>
    </>
  );
}
