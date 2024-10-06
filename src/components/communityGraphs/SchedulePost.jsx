import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  Grid,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { FaRegCalendarAlt, FaListUl } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SchedulePost = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    publicationDate: "",
    publicationTime: "",
    groups: [],
    message: "",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenCalendar = () => setOpenCalendar(true);
  const handleCloseCalendar = () => setOpenCalendar(false);

  const handleAddPost = () => {
    setScheduledPosts((prev) => [...prev, formData]);
    setFormData({
      title: "",
      publicationDate: "",
      publicationTime: "",
      groups: [],
      message: "",
    });
    handleCloseModal();
  };

  const handleToggleView = () => {
    setIsListView((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderScheduledPosts = () => {
    return scheduledPosts.length > 0 ? (
      <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Publication Date</TableCell>
              <TableCell>Publication Time</TableCell>
              <TableCell>Groups</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduledPosts.map((post, index) => (
              <TableRow key={index}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.publicationDate}</TableCell>
                <TableCell>{post.publicationTime}</TableCell>
                <TableCell>{post.groups.join(", ")}</TableCell>
                <TableCell>{post.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No scheduled posts.</Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px",
        backgroundColor: "transparent",
        borderRadius: "8px",
        flexDirection: "row",
        flexGrow: 1,
      }}
    >
      {/* Left Side - Scheduled Posts */}
      <Box sx={{ flex: 1, marginRight: "20px" }}>
        <Typography variant="h5" marginBottom="20px">Scheduled Posts</Typography>
        {renderScheduledPosts()}
      </Box>

      {/* Right Side - Buttons and Modal */}
      <Box sx={{ width: "300px" }}>
        {/* Buttons aligned to the right */}
        <Box display="flex" justifyContent="flex-end" marginBottom="20px">
          <Box display="flex" alignItems="center">
            {/* List Icon */}
            <IconButton
              onClick={() => setIsListView(true)}
              sx={{
                backgroundColor: isListView ? "rgba(255, 255, 255, 0.1)" : "transparent",
                padding: 0,
                marginRight: "5px",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <FaListUl color={isListView ? "#01c0ff" : "#ffffff"} size={24} />
            </IconButton>

            {/* Calendar Icon */}
            <IconButton
              onClick={handleOpenCalendar}
              sx={{
                backgroundColor: !isListView ? "rgba(255, 255, 255, 0.1)" : "transparent",
                padding: 0,
                marginRight: "10px",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <FaRegCalendarAlt color={!isListView ? "#01c0ff" : "#ffffff"} size={24} />
            </IconButton>

            {/* Add Button */}
            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{
                width: "120px",
                backgroundColor: "#01c0ff",
                color: "#ffffff",
                border: "1px solid #ffffff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              + Add
            </Button>
          </Box>
        </Box>

        {/* Modal for adding a new post */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 400,
              backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              margin: "100px auto",
              color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            <Typography variant="h5" marginBottom="20px">
              Schedule a Post
            </Typography>

            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{
                input: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                label: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Publication Date"
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    input: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                    label: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time"
                  type="time"
                  name="publicationTime"
                  value={formData.publicationTime}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  sx={{
                    input: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                    label: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Groups"
              name="groups"
              value={formData.groups.join(", ")}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "groups", value: e.target.value.split(",") },
                })
              }
              fullWidth
              margin="normal"
              sx={{
                input: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                label: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
              }}
            />
            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              sx={{
                input: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
                label: { color: theme.palette.mode === "dark" ? "#ffffff" : "#000000" },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddPost}
              sx={{ marginTop: "20px", backgroundColor: "#01c0ff" }}
            >
              Schedule
            </Button>
          </Box>
        </Modal>

        {/* Calendar Modal */}
        <Modal open={openCalendar} onClose={handleCloseCalendar}>
          <Box
            sx={{
              width: 400,
              backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              margin: "100px auto",
              color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            <Typography variant="h5" marginBottom="20px">
              Select a Date
            </Typography>
            <Calendar />
            <Button
              variant="contained"
              onClick={handleCloseCalendar}
              sx={{ marginTop: "20px", backgroundColor: "#01c0ff" }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default SchedulePost;
