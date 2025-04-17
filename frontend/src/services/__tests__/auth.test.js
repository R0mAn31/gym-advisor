/** @format */

import { signIn, signUp, signOut, getCurrentUser } from "../auth";
import { auth } from "../firebase";

jest.mock("../firebase", () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should call firebase signInWithEmailAndPassword with correct parameters", async () => {
      const email = "test@example.com";
      const password = "password123";

      auth.signInWithEmailAndPassword.mockResolvedValueOnce({
        user: { uid: "123" },
      });

      await signIn(email, password);

      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );
    });

    it("should throw an error when sign in fails", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";

      auth.signInWithEmailAndPassword.mockRejectedValueOnce(
        new Error("Invalid credentials")
      );

      await expect(signIn(email, password)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("signUp", () => {
    it("should call firebase createUserWithEmailAndPassword with correct parameters", async () => {
      const email = "newuser@example.com";
      const password = "newpassword123";

      auth.createUserWithEmailAndPassword.mockResolvedValueOnce({
        user: { uid: "456" },
      });

      await signUp(email, password);

      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );
    });
  });

  describe("signOut", () => {
    it("should call firebase signOut method", async () => {
      auth.signOut.mockResolvedValueOnce();

      await signOut();

      expect(auth.signOut).toHaveBeenCalled();
    });
  });
});
