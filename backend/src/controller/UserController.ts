import { Request, Response } from "express";
import { UserService } from "../services/UserService";
UserService

export class UserController {
  private userService = new UserService();

  async login(request: Request, response: Response) {
    const { email, password, role } = request.body;

    if (!email || !password || !role) {
      return response.status(400).json({ message: "Email, password and role are required" });
    }

    try {
      const user = await this.userService.login(email, password);
      if (!user) {
        return response.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user's role matches the requested role
      if (user.role !== role) {
        return response.status(403).json({ message: "Invalid role for this user" });
      }

      // Remove password from response
      return response.json(user);
    } catch (error) {
      return response.status(500).json({ message: "Error during login", error });
    }
  }

  async signUp(request: Request, response: Response) {
    const { firstName, lastName, email, password, role, previous_roles, academic_credentials, number_of_accepted_applications } = request.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return response.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return response.status(409).json({ message: "Email already exists" });
      }

      // Create new user
      const user = await this.userService.createUser({
        firstName,
        lastName,
        email,
        password,
        role,
        previous_roles: previous_roles || [],
        academic_credentials: academic_credentials || [],
      });

      return response.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return response.status(500).json({ message: "Error creating user", error });
    }
  }

  async getUserByIdWithSkills(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const user = await this.userService.getUserByIdWithSkills(parseInt(id, 10));
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
      return response.status(201).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return response.status(500).json({ message: "Error fetching user", error });
    }
  }

}
