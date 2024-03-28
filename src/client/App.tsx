import { useEffect, useState } from "react";
import io from "socket.io-client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { copyToClipboard, formatDateTime, takeRight, uniqueId } from "./utils";

const darkTheme = createTheme({ palette: { mode: "dark" } });

export default function App() {
  const [mqttData, setMqttData] = useState<
    { id: string; timestamp: string; data: any }[]
  >([]);

  useEffect(() => {
    // Connect to Socket.IO server
    const location = window.location;

    const socket = io(
      `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}`
    );

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("mqttData", (data: string) => {
      console.log("Received MQTT data:", data);
      setMqttData((mqttData) =>
        takeRight(
          [
            ...mqttData,
            {
              id: uniqueId(),
              timestamp: new Date().toISOString(),
              data: JSON.parse(data),
            },
          ],
          10
        )
      );
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Run only once on component mount

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ mt: 6 }}>
        <Stack spacing={2}>
          <Typography variant="h3">Smart IR Logger</Typography>
          <Typography variant="subtitle1">
            Press a button to start logging
          </Typography>
          <Divider />
          {mqttData.reverse().map((it, index) => (
            <Card
              key={it.timestamp}
              sx={{
                transition: "opacity 200ms ease-in-out",
                opacity: index > 0 ? 0.4 : 1,
                "&:hover": { opacity: 1 },
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {formatDateTime(new Date(it.timestamp)).toLocaleString()}
                </Typography>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(it.data, null, 2)}
                </pre>
              </CardContent>
              <CardActions>
                {it.data.IrReceived.Data && (
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(it.data.IrReceived.Data)}
                  >
                    Copy data
                  </Button>
                )}

                {it.data.IrReceived.Hash && (
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(it.data.IrReceived.Hash)}
                  >
                    Copy hash
                  </Button>
                )}

                {it.data.IrReceived.RawData && (
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(it.data.IrReceived.RawData)}
                  >
                    Copy raw data
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
