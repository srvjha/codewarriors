import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import type { Playlist } from "@/types/problem/problemTypes";
import API from "@/utils/AxiosInstance";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";
import {
  Search,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  Clock,
  Play,
  Code2,
  Zap,
  Plus,
  PlusCircle,
  Trash,
  Pencil,
  Copy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import CreatePlaylistModal from "@/components/ui/CreatePlaylistModal";
import { formatDistanceToNow } from "date-fns";
import AddProblemsModal from "@/components/ui/AddProblemModal";
import { Link } from "react-router-dom";
import { debounce } from "@/utils/debounce";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ClipLoader } from "react-spinners";

const PlaylistPage = () => {
  const [privatePlaylists, setPrivatePlaylists] = useState<Playlist[]>([]);
  const [publicPlaylists, setPublicPlaylists] = useState<Playlist[]>([]);
  const[loading,setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recommended, setRecommend] = useState<Playlist[]>([]);
  const [companyBased, setCompanyBased] = useState<Playlist[]>([]);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState({
    playlistName: "",
    playlistId: "",
  });

  const searchRef =
    useRef<(event: React.ChangeEvent<HTMLInputElement>) => void | null>(null);

  const { userData } = useSelector((state: RootState) => state.auth);

  const allPrivatePlaylistsDetails = async () => {
    try {
      const response = await API.get("/playlist/all/private", {
        withCredentials: true,
      });
      // console.log("private: ", response.data.data);
      setPrivatePlaylists(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }finally {
      setLoading(false);
    }
  };

  const allPublicPlaylistsDetails = async () => {
    try {
      const response = await API.get("/playlist/all/public", {
        withCredentials: true,
      });
      // for favourite
      const data = response.data.data.filter(
        (d: Playlist) => d.type === "public"
      );
      console.log({ public: data });
      const companyBasedSheets = response.data.data.filter(
        (d: Playlist) => d.type === "company"
      );
      setPublicPlaylists(data || []);
      setRecommend(response.data.data || []);
      setCompanyBased(companyBasedSheets);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    allPrivatePlaylistsDetails();
    allPublicPlaylistsDetails();
  }, [showAddModal, showCreateModal]);

  const handleRemovePlaylist = async (playListId: string) => {
    try {
      const res = await API.delete(`/playlist/${playListId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        ToastSuccess(res.data.message);
        await allPrivatePlaylistsDetails();
        await allPublicPlaylistsDetails();
      }
    } catch (err: any) {
      ToastError(err.response.data.error);
    }
  };

  const getDynamicRecommendedSheets = () => {
    const filteredRecommended = recommended.filter(
      (playlist) =>
        playlist.name === "Beginner's Foundation" ||
        playlist.name === "Intermediate Mastery" ||
        playlist.name === "Advanced Conquest"
    );

    const styleOptions = [
      {
        difficulty: "Easy",
        icon: <BookOpen className="w-5 h-5" />,
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        cardColor:
          "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
        buttonColor:
          "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer",
      },
      {
        difficulty: "Medium",
        icon: <Target className="w-5 h-5" />,
        badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        cardColor:
          "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
        buttonColor:
          "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer",
      },
      {
        difficulty: "Hard",
        icon: <TrendingUp className="w-5 h-5" />,
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
        cardColor: "bg-red-500/5 border-red-500/20 hover:border-red-500/40",
        buttonColor: "bg-red-600 hover:bg-red-700 text-white cursor-pointer",
      },
    ];

    return filteredRecommended.map((playlist, index) => ({
      id: playlist.id,
      title: playlist.name,
      description:
        playlist.description || "Curated problems for skill development",
      problems: playlist.problems.length,
      difficulty: styleOptions[index % styleOptions.length].difficulty,
      icon: styleOptions[index % styleOptions.length].icon,
      badgeColor: styleOptions[index % styleOptions.length].badgeColor,
      cardColor: styleOptions[index % styleOptions.length].cardColor,
      buttonColor: styleOptions[index % styleOptions.length].buttonColor,
      playlist: playlist,
    }));
  };

  const handleCreatePlayList = () => {
    setShowCreateModal(true);
  };

  const handleAddProblemToPlaylist = (name: string, id: string) => {
    setShowAddModal(true);
    setSelectedPlaylist({ playlistName: name, playlistId: id });
  };

  const handleSheetSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      searchRef.current(event);
    }
  };

  useEffect(() => {
    searchRef.current = debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase().trim();

        if (!query) {
          allPrivatePlaylistsDetails();
          allPublicPlaylistsDetails();
          return;
        }

        const filteredPrivate = privatePlaylists.filter((playlist) => {
          return playlist.name.toLowerCase().includes(query);
        });

        // Filter public playlists
        const filteredPublic = publicPlaylists.filter((playlist) => {
          return playlist.name.toLowerCase().includes(query);
        });

        const filteredRecommended = recommended.filter((playlist) => {
          const difficultyKeywords = ["beginner", "intermediate", "advanced"];
          const matchesDifficulty = difficultyKeywords.some(
            (keyword) =>
              query.includes(keyword) &&
              ((playlist.name.toLowerCase().includes("easy") &&
                keyword === "easy") ||
                (playlist.name.toLowerCase().includes("medium") &&
                  (keyword === "medium" || keyword === "intermediate")) ||
                (playlist.name.toLowerCase().includes("hard") &&
                  (keyword === "hard" || keyword === "advanced")) ||
                (keyword === "beginner" &&
                  playlist.name.toLowerCase().includes("easy")))
          );

          return (
            playlist.name.toLowerCase().includes(query) ||
            (playlist.description &&
              playlist.description.toLowerCase().includes(query)) ||
            matchesDifficulty
          );
        });

        const filteredCompanyBased = companyBased.filter((playlist) => {
          const companyNames = [
            "google",
            "amazon",
            "microsoft",
            "meta",
            "apple",
            "netflix",
            "uber",
            "airbnb",
          ];
          const matchesCompany = companyNames.some(
            (company) =>
              query.includes(company) &&
              playlist.name.toLowerCase().includes(company)
          );

          return (
            playlist.name.toLowerCase().includes(query) ||
            (playlist.description &&
              playlist.description.toLowerCase().includes(query)) ||
            matchesCompany ||
            query.includes("company") ||
            query.includes("interview")
          );
        });

        // Update state with filtered results
        setPrivatePlaylists(filteredPrivate);
        setPublicPlaylists(filteredPublic);
        setRecommend(filteredRecommended);
        setCompanyBased(filteredCompanyBased);
      },
      1000
    );
  }, [privatePlaylists, publicPlaylists, recommended, companyBased]);

  const handleEditPlaylist = (id: string) => {
    const playlistToEdit = [...publicPlaylists, ...privatePlaylists].find(
      (playlist) => playlist.id === id
    );

    if (playlistToEdit) {
      setEditingPlaylist(playlistToEdit);
      setShowCreateModal(true);
    }
  };
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingPlaylist(null);
  };

  const createClone = async (playListid: string) => {
    try {
      const res = await API.post(`/playlist/${playListid}/clone`);
      if (res.status) {
        ToastSuccess(res.data.message);
        allPrivatePlaylistsDetails();
      }
    } catch (error: any) {
      ToastError(error.response.data.error || "Failed to create clone");
    }
  };
  return (
    <>
      {loading && (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClipLoader size={50} color="#4F46E5" />
        </div>
      )}
      <Toast />
      {showCreateModal && (
        <CreatePlaylistModal
          defaultName={editingPlaylist?.name || ""}
          defaultDescription={editingPlaylist?.description || ""}
          defaultVisibility={
            editingPlaylist?.type === "public" ? "public" : "private"
          }
          playlistId={editingPlaylist?.id || null}
          isEditing={!!editingPlaylist}
          onClose={handleCloseCreateModal}
        />
      )}
      <AddProblemsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        playlistName={selectedPlaylist.playlistName}
        playlistId={selectedPlaylist.playlistId}
      />

      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto p-6 space-y-10">
          <div className="text-center space-y-6 pt-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-neutral-900 rounded-2xl shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold ">DSA Sheets</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Master Data Structures & Algorithms with curated problem sets.
              From beginner-friendly challenges to advanced company-specific
              questions.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search sheets by name, topic, or company..."
                onChange={handleSheetSearch}
                className="pl-12 pr-6 py-4 text-lg bg-gray-900/50 border-gray-800 focus:border-blue-500 rounded-2xl backdrop-blur-sm text-gray-100 placeholder:text-gray-400 shadow-xl"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-100">
                Public Sheets
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicPlaylists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-400/50 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-xl">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                        <CardTitle className="text-xl text-gray-100 flex items-center gap-2">
                          {playlist?.name}
                          <Badge className="bg-amber-50 text-amber-800 text-xs">
                            Public
                          </Badge>
                        </CardTitle>
                      </div>
                      {playlist.user.fullName === userData?.fullName && (
                        <div className="flex mt-2 justify-center items-center gap-2">
                          <Pencil
                            className="w-4 h-4 text-neutral-400 hover:text-blue-400 cursor-pointer"
                            onClick={() => handleEditPlaylist(playlist.id)}
                          />
                          <Trash
                            className="w-4 h-4 text-neutral-400 hover:text-red-400 cursor-pointer"
                            onClick={() => handleRemovePlaylist(playlist.id)}
                          />
                        </div>
                      )}
                    </div>
                    <CardDescription className="text-gray-300 h-8 mt-2">
                      {playlist?.description || "No Description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-2 ">
                      <div className="flex  flex-col  gap-1 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {playlist.problems.length}{" "}
                          {playlist?.problems.length === 1
                            ? "problem"
                            : "problems"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={14} />{" "}
                          {playlist?.updatedAt
                            ? formatDistanceToNow(
                                new Date(playlist.updatedAt),
                                {
                                  addSuffix: true,
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-1 mb-2">
                        <Button
                          size="sm"
                          className="bg-yellow-500 flex-1 cursor-pointer hover:bg-yellow-600 text-gray-900 font-medium"
                          onClick={() =>
                            handleAddProblemToPlaylist(
                              playlist.name,
                              playlist.id
                            )
                          }
                        >
                          <PlusCircle className="w-4 h-4 mt-1" />
                          Add Problems
                        </Button>
                        <Link to={`/${playlist?.name}/${playlist?.id}`}>
                          <Button
                            size="sm"
                            className="bg-yellow-500 flex-1 cursor-pointer hover:bg-yellow-600 text-gray-900 font-medium"
                          >
                            <Play className="w-4 h-4 " />
                            Solve
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-100">
                Private Sheets
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privatePlaylists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="group hover:shadow-2xl transition-all duration-300 bg-gray-900/50 border border-gray-700 hover:border-gray-600 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 mr-1.5">
                        <CardTitle className="text-xl text-gray-100 flex items-center gap-2 line-clamp-1">
                          {playlist?.name}
                        </CardTitle>
                        <Badge className="bg-amber-50 text-gray-800 text-xs">
                          {playlist?.type}
                        </Badge>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <Pencil
                          className="w-4 h-4 text-neutral-400 hover:text-blue-400 cursor-pointer"
                          onClick={() => handleEditPlaylist(playlist.id)}
                        />

                        <Trash
                          className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-400"
                          onClick={() => handleRemovePlaylist(playlist.id)}
                        />
                      </div>
                    </div>
                    <CardDescription className="text-sm text-gray-400 mt-1  h-10">
                      {playlist.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-sm text-gray-400 space-y-2">
                    <span className="text-sm text-gray-400 flex gap-2">
                      <Target className="w-4 h-4" />
                      <span className="-mt-1">
                        {playlist.problems.length}{" "}
                        {playlist.problems.length === 1
                          ? "problem"
                          : "problems"}
                      </span>
                    </span>
                    <div className="flex justify-between items-center -mt-1">
                      <span>
                        👤{" "}
                        <span className="font-medium text-gray-300">
                          {playlist.user.fullName}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />{" "}
                        {formatDistanceToNow(new Date(playlist.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-1 mb-2">
                      <Button
                        variant="outline"
                        className="w-full flex-1 cursor-pointer border border-dashed border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 bg-transparent"
                        onClick={() =>
                          handleAddProblemToPlaylist(playlist.name, playlist.id)
                        }
                      >
                        <PlusCircle className="w-4 h-4 mt-1" />
                        Add Problems
                      </Button>

                      <Link to={`/${playlist?.name}/${playlist?.id}`}>
                        <Button
                          variant="outline"
                          className="w-full flex-1 cursor-pointer border border-dashed border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 bg-transparent"
                        >
                          <Play className="w-4 h-4 " />
                          Solve
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="group flex-row  justify-end hover:shadow-2xl transition-all duration-300 bg-gray-900/50 border-gray-700 hover:border-gray-600 border-dashed backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700/50 rounded-xl">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <CardTitle className="text-xl text-gray-300">
                        Create New Sheet
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Build your custom problem collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-17">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer border-dashed border-2 border-gray-600 hover:border-blue-500 hover:text-blue-400 text-gray-300 bg-transparent"
                    onClick={handleCreatePlayList}
                  >
                    <Zap className="w-4 h-4" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-100">
                Recommended by Difficulty
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getDynamicRecommendedSheets().map((sheet) => (
                <Card
                  key={sheet.id}
                  className={`group hover:shadow-2xl transition-all duration-300 ${sheet.cardColor} backdrop-blur-sm`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gray-800/50 rounded-xl text-gray-300">
                        {sheet.icon}
                      </div>
                      <Badge className={sheet.badgeColor}>
                        {sheet.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-100 group-hover:text-white transition-colors">
                      {sheet.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {sheet.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {sheet.problems} problems
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Link
                          to={`/${sheet.playlist.name}/${sheet.playlist.id}`}
                        >
                          <Button size="sm" className={sheet.buttonColor}>
                            <Play className="w-4 h-4" />
                            Solve
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-neutral-300 text-neutral-800 cursor-pointer hover:bg-neutral-400"
                          onClick={() => createClone(sheet.playlist.id)}
                        >
                          <Copy className="w-4 h-4 " />
                          Clone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-100">
                Company Based Sheets
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyBased.map((company) => (
                <Card
                  key={company.id}
                  className={`group hover:shadow-2xl transition-all duration-300 bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 backdrop-blur-sm`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex mb-4">
                      <img
                        src={`https://logo.clearbit.com/${company.name
                          .split(" ")[0]
                          .toLowerCase()}.com`}
                        className="w-7 h-7 object-contain mt-2"
                        alt="logo"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-gray-100 transition">
                      {company.name} Interview Questions
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm mt-1">
                      {company.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {company.problems.length} problems
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Link to={`/${company.name}/${company.id}`}>
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                          >
                            <Play className="w-4 h-4" />
                            Solve
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-neutral-300 text-neutral-800 cursor-pointer hover:bg-neutral-400"
                          onClick={() => createClone(company.id)}
                        >
                          <Copy className="w-4 h-4 " />
                          Clone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistPage;
