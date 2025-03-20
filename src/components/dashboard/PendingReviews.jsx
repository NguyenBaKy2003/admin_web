import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Rating,
} from "@mui/material";
import { fetchPendingReviews } from "../data/mockData.js";

function PendingReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      const data = await fetchPendingReviews();
      setReviews(data);
    };

    getReviews();
  }, []);

  return (
    <Paper sx={{ p: 2, borderRadius: 1 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Pending Reviews
      </Typography>
      <List>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ListItem key={review.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={review.name} src={review.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1" fontWeight="bold">
                      {review.name}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.text}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Avatar
                        variant="square"
                        src={review.productImage}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {review.productName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ngày đánh giá: {review.reviewDate}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Không có đánh giá nào đang chờ duyệt.
          </Typography>
        )}
      </List>
    </Paper>
  );
}

export default PendingReviews;
