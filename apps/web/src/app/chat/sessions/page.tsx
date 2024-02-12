import {
  Box,
  Card,
  CardContent,
  Divider,
  SxProps,
  Typography,
} from "@mui/material";

type SessionInfo = {
  title: string;
  lastMessage: string;
  model: string;
};

const pageSx = {
  SessionItem: {
    modelText: {},
    titleText: {},
    lastMessageText: {},
  },
} as const satisfies Record<string, SxProps | Record<string, SxProps>>;

const sessions: SessionInfo[] = [
  {
    title: "Session 1",
    lastMessage: "Last message",
    model: "tinyLlama",
  },
  {
    title: "Session 1",
    lastMessage: "Last message",
    model: "tinyLlama",
  },
  {
    title: "Session 1",
    lastMessage: "Last message",
    model: "tinyLlama",
  },
];

const sessionCount = sessions.length;

function SessionItem(
  i: number,
  title: string,
  lastMessage: string,
  model: string,
) {
  const {
    modelText: modelTextSx,
    lastMessageText: lastMessageTextSx,
    titleText: titleTextSx,
  } = pageSx.SessionItem;
  return (
    <Box key={`${i}-${title}`} sx={{ width: "100%" }}>
      <Typography variant="body2" sx={modelTextSx}>
        {model}
      </Typography>
      <Typography variant="h6" sx={titleTextSx}>
        {title}
      </Typography>
      <Typography variant="body1" sx={lastMessageTextSx}>
        {lastMessage}
      </Typography>
    </Box>
  );
}

export default function chatSessions() {
  return (
    <Card variant="outlined" sx={{ width: "100vw" }}>
      <Typography
        textAlign={"center"}
        fontWeight={"bold"}
        fontSize={"2em"}
        marginBlock={"0.5em"}
      >
        Chat Sessions
      </Typography>
      <CardContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        {sessions.map((session, i) => (
          <>
            {SessionItem(i, session.title, session.lastMessage, session.model)}
            {i < sessionCount - 1 && (
              <Divider
                sx={{
                  marginBlock: "1em",
                }}
              />
            )}
          </>
        ))}
      </CardContent>
    </Card>
  );
}
