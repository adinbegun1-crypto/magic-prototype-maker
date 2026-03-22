import { beforeEach, describe, expect, it } from "vitest";
import {
  getCurrentDemoUser,
  resetDemoUser,
  signInDemoUser,
  signOutDemoUser,
  signUpDemoUser,
  updateDemoUser,
} from "@/lib/demoAccountStorage";

describe("demoAccountStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates and signs into separate demo accounts", () => {
    const firstUser = signUpDemoUser("Adin Cohen", "adin@example.com");
    signOutDemoUser();
    const secondUser = signUpDemoUser("Maya Levi", "maya@example.com");

    expect(firstUser.profile.id).toBe("adin@example.com");
    expect(secondUser.profile.id).toBe("maya@example.com");
    expect(getCurrentDemoUser()?.profile.email).toBe("maya@example.com");

    signOutDemoUser();
    signInDemoUser("adin@example.com");

    expect(getCurrentDemoUser()?.profile.fullName).toBe("Adin Cohen");
    expect(getCurrentDemoUser()?.portfolio.total).toBe(48320.5);
  });

  it("resets a saved account without deleting it", () => {
    const createdUser = signUpDemoUser("Adin Cohen", "adin@example.com");

    updateDemoUser(createdUser.profile.id, (user) => ({
      ...user,
      savings: user.savings.map((goal, index) =>
        index === 0 ? { ...goal, current: 1000 } : goal
      ),
    }));

    const resetUser = resetDemoUser(createdUser.profile.id);

    expect(resetUser?.profile.email).toBe("adin@example.com");
    expect(resetUser?.savings[0].current).toBe(62400);
    expect(getCurrentDemoUser()?.profile.fullName).toBe("Adin Cohen");
  });
});
