"use client";
import { applicant } from "@/types/applicant";
import { course } from "@/types/course";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApplicantTable from "./applicantTable";
import ApplicantSummary from "./applicantSummary";
import axios from "axios";
import { get } from "http";

interface CourseProps {
  course: course;
}

export default function CourseMain({ course }: CourseProps) {
  const [applicants, setApplicants] = useState<applicant[] | null>(null);
  const [skillInput, setSkillInput] = useState<string>(""); // changed from array to string
  const [skillError, setSkillError] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [availability, setAvailability] = useState<'Any' | 'Part Time' | 'Full Time'>("Any");

  const regex = /^[A-Za-z\s,]*$/; // allow letters, spaces, and commas
  const nameRegex = /^[A-Za-z\s'-]*$/;

  // Generic filter creator which parses the skill input string into an array
  const createFilter = () => {
    return {
      skillList: skillInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      name: name,
      availability: availability,
    };
  };

  const getApplicants = async () => {

    try {
      const response = await axios.get(
        `http://localhost:3001/api/applications/course/${course.id}/filtered`,
        {
          params: createFilter(),
        }
      );
      if (response.status === 200) {
        setApplicants(response.data);
      } else {
        console.error("Failed to fetch applicants");
      }
    }
    catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, []);

  const clearFilters = () => {
    setSkillInput("");
    setName("");
    setAvailability("Any");
    
    try {
      axios.get(`http://localhost:3001/api/applications/course/${course.id}/filtered`, {
          params: {
            skillList: [],
            name: "",
            availability: "Any",
          },
        }
      )
      .then(response => {
        if (response.status === 200) {
          setApplicants(response.data);
        } else {
          console.error("Failed to fetch applicants");
        }
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const handleAndValidateSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    value.trim();
    if (regex.test(value)) {
      setSkillInput(value);
      setSkillError(false);
    } else {
      setSkillError(true);
    }
  };

  const handleAndValidateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    value.trim();
    if (nameRegex.test(value) || value === '') {
      setName(value);
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  return (
    <Box sx={{padding: 2}}>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1 }, color: "white" }}
        noValidate
        autoComplete="off"
      >
        <FormGroup>
          <FormControl sx={{ m: 1 }} variant="outlined">
            <TextField
              label="Skill"
              value={skillInput}
              onChange={handleAndValidateSkillChange}
              error={skillError}
              helperText={
                skillError
                  ? "Please input only letters, spaces, and commas"
                  : "Enter skills separated by commas"
              }
              placeholder="Enter skills separated by commas"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }} variant="outlined">
            <TextField
              label="Name"
              value={name}
              onChange={handleAndValidateNameChange}
              error={nameError}
              helperText={nameError ? "Please enter a valid name" : ""}
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }} variant="outlined">
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              id="availability"
              value={availability}
              label="Availability"
              onChange={(e) =>
                setAvailability(e.target.value as "Part Time" | "Full Time" | "Any")
              }
            >
              <MenuItem value="Any">Any</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Full Time">Full Time</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={getApplicants}>
            Filter
          </Button>
          <Button variant="contained" color="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </FormGroup>
      </Box>
      {course.applications.length > 0 && applicants !== null && (
        <Box>
          <ApplicantSummary course={course}/>
        </Box>
      )}
      {applicants && applicants.length > 0 ? (
        <ApplicantTable course={course} applicants={applicants} />
      ) : (
        <Box sx={{ margin: 2 }}>
          No applicants found.
        </Box>
      )}
    </Box>
  );
}