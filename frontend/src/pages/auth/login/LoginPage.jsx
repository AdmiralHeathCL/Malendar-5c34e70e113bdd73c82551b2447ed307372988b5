import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const phrases = [
  "按时 交作业。",
  "请认真学习。",
  "欢迎回来！",
  "不要 逃教辅。",
  "别吃 螺蛳粉。",
];

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [randomPhrase, setRandomPhrase] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setRandomPhrase(phrases[randomIndex]);
  }, []);

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("登录成功");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        {/* Replace the XSvg with the martz_svg.png */}
        <img src="/assets/martz_svg.png" alt="Martz Logo" className="lg:w-2/3" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          {/* Replace the XSvg with the martz_svg.png for smaller screens */}
          <img src="/assets/martz_svg.png" alt="Martz Logo" className="w-24 lg:hidden" />
          <h1 className="text-4xl font-extrabold text-white">{randomPhrase}</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="用户名"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="密码"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "登录"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">没有账号?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">注册账号</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;