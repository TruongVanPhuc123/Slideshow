import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import GroupManagement from "./group-management";
import CurrentTimeAndScheduling from "./CurrentTimeAndScheduling";
import ActiveGroupAlert from "./ActiveGroupAlert";
import SlideshowDisplay from "./SlideshowDisplay";
import PlaybackControls from "./PlaybackControls";
import StorageControls from "./StorageControls";
import StorageErrorAlert from "./StorageErrorAlert";

export default function Slideshow() {
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [timeUnit, setTimeUnit] = useState("seconds"); // "seconds" hoặc "minutes"
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);
  const [useScheduling, setUseScheduling] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeScheduledGroup, setActiveScheduledGroup] = useState([]);
  const [allActiveImages, setAllActiveImages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const clockTimerRef = useRef(null);
  const slideshowContainerRef = useRef(null);

  // Update current time every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    // Update immediately
    updateCurrentTime();

    // Then update every minute
    clockTimerRef.current = setInterval(updateCurrentTime, 60000);

    return () => {
      if (clockTimerRef.current) {
        clearInterval(clockTimerRef.current);
      }
    };
  }, []);

  // Check which group should be active based on current time
  useEffect(() => {
    if (!useScheduling) return;

    const findActiveGroups = () => {
      const now = currentTime;
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Tìm tất cả các group có thời gian phù hợp với thời gian hiện tại
      const activeGroupIndices = groups.reduce((indices, group, index) => {
        if (!group.scheduling || !group.scheduling.enabled) return indices;

        const startHour = Number.parseInt(
          group.scheduling.startTime.split(":")[0]
        );
        const startMinute = Number.parseInt(
          group.scheduling.startTime.split(":")[1]
        );
        const startTimeInMinutes = startHour * 60 + startMinute;

        const endHour = Number.parseInt(group.scheduling.endTime.split(":")[0]);
        const endMinute = Number.parseInt(
          group.scheduling.endTime.split(":")[1]
        );
        const endTimeInMinutes = endHour * 60 + endMinute;

        // Xử lý trường hợp thời gian qua nửa đêm
        if (startTimeInMinutes <= endTimeInMinutes) {
          // Trường hợp bình thường: startTime trước endTime
          if (
            currentTimeInMinutes >= startTimeInMinutes &&
            currentTimeInMinutes < endTimeInMinutes
          ) {
            indices.push(index);
          }
        } else {
          // Trường hợp qua đêm: endTime là ngày hôm sau
          if (
            currentTimeInMinutes >= startTimeInMinutes ||
            currentTimeInMinutes < endTimeInMinutes
          ) {
            indices.push(index);
          }
        }
        return indices;
      }, []);

      if (activeGroupIndices.length > 0) {
        setActiveScheduledGroup(activeGroupIndices);

        // Nếu đang phát và group hiện tại không active, chuyển sang group active đầu tiên
        if (isPlaying && !activeGroupIndices.includes(currentGroupIndex)) {
          setCurrentGroupIndex(activeGroupIndices[0]);
          setCurrentImageIndex(0);
        }
      } else {
        setActiveScheduledGroup([]);
      }
    };

    findActiveGroups();
  }, [currentTime, groups, useScheduling, isPlaying, currentGroupIndex]);

  // Cập nhật danh sách ảnh khi có group active
  useEffect(() => {
    if (!useScheduling) return;

    // Gộp tất cả ảnh từ các group đang active
    const activeImages = activeScheduledGroup.reduce((acc, groupIndex) => {
      const group = groups[groupIndex];
      if (group && group.images) {
        return [...acc, ...group.images];
      }
      return acc;
    }, []);

    setAllActiveImages(activeImages);
  }, [activeScheduledGroup, groups, useScheduling]);

  // Load groups from localStorage on component mount
  useEffect(() => {
    const loadSavedGroups = async () => {
      try {
        setIsLoading(true);
        const savedData = localStorage.getItem("slideshowGroups");
        const savedSchedulingState = localStorage.getItem(
          "slideshowScheduling"
        );

        if (savedSchedulingState) {
          setUseScheduling(JSON.parse(savedSchedulingState));
        }

        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // Process the saved groups to restore image URLs from data URLs
          const restoredGroups = await Promise.all(
            parsedData.map(async (group) => {
              // Ensure scheduling data exists
              if (!group.scheduling) {
                group.scheduling = {
                  enabled: false,
                  startTime: "09:00",
                  endTime: "17:00",
                };
              }

              // Restore images with their data URLs
              return {
                ...group,
                images: group.images.map((image) => ({
                  ...image,
                  // The file object can't be stored, but we have the dataURL
                  file: null,
                })),
              };
            })
          );

          setGroups(restoredGroups);
          toast.success(
            `Loaded ${restoredGroups.length} groups from local storage.`
          );
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        setStorageError(
          "Failed to load saved slideshow data. Local storage might be corrupted."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedGroups();
  }, []);

  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (isLoading) return; // Skip saving during initial load

    const saveGroups = async () => {
      try {
        // We need to prepare the groups for storage
        // Images need special handling since File objects can't be serialized
        const storableGroups = groups.map((group) => ({
          ...group,
          images: group.images.map((image) => ({
            id: image.id,
            url: image.url,
            name: image.name,
          })),
        }));

        localStorage.setItem("slideshowGroups", JSON.stringify(storableGroups));
        localStorage.setItem(
          "slideshowScheduling",
          JSON.stringify(useScheduling)
        );
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        setStorageError("Failed to save slideshow data to local storage.");
      }
    };

    saveGroups();
  }, [groups, useScheduling, isLoading]);

  const nextImage = useCallback(() => {
    if (groups.length === 0) return;

    // If scheduling is enabled, only allow playing the active scheduled group
    if (
      useScheduling &&
      activeScheduledGroup.length > 0 &&
      !activeScheduledGroup.includes(currentGroupIndex)
    ) {
      setCurrentGroupIndex(activeScheduledGroup[0]);
      setCurrentImageIndex(0);
      return;
    }

    const currentGroup = groups[currentGroupIndex];
    if (!currentGroup || currentGroup.images.length === 0) return;

    if (currentImageIndex < currentGroup.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Move to next group
      if (useScheduling && activeScheduledGroup.length > 0) {
        // In scheduling mode, stay in the active group and loop
        setCurrentImageIndex(0);
      } else {
        // Normal mode - move to next group
        if (currentGroupIndex < groups.length - 1) {
          setCurrentGroupIndex(currentGroupIndex + 1);
          setCurrentImageIndex(0);
        } else {
          // Loop back to first group
          setCurrentGroupIndex(0);
          setCurrentImageIndex(0);
        }
      }
    }
  }, [
    groups,
    useScheduling,
    activeScheduledGroup,
    currentGroupIndex,
    currentImageIndex,
    setCurrentGroupIndex,
    setCurrentImageIndex,
  ]);

  // Tính toán thời gian delay thực tế (đổi sang milliseconds)
  const getActualDelay = useCallback(() => {
    const baseDelay = speed * 1000; // Chuyển đổi sang milliseconds
    return timeUnit === "minutes" ? baseDelay * 60 : baseDelay;
  }, [speed, timeUnit]);

  // Handle slideshow autoplay
  useEffect(() => {
    if (isPlaying && groups.length > 0) {
      // If scheduling is enabled, check if we have an active group
      if (useScheduling && activeScheduledGroup.length === 0) {
        setIsPlaying(false);
        toast.error("No group is scheduled for the current time.");
        return;
      }

      const currentGroup = groups[currentGroupIndex];
      if (!currentGroup || currentGroup.images.length === 0) {
        setIsPlaying(false);
        return;
      }

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set new timer based on current group duration and speed
      const delay = getActualDelay();
      timerRef.current = setTimeout(nextImage, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isPlaying,
    currentGroupIndex,
    currentImageIndex,
    groups,
    speed,
    useScheduling,
    activeScheduledGroup,
    nextImage,
    getActualDelay,
  ]);

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      slideshowContainerRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    // Add fullscreen styles
    const handleFullscreenChange = () => {
      const isFullscreenNow = document.fullscreenElement !== null;
      setIsFullscreen(isFullscreenNow);

      if (slideshowContainerRef.current) {
        if (isFullscreenNow) {
          slideshowContainerRef.current.classList.add("fullscreen-mode");
        } else {
          slideshowContainerRef.current.classList.remove("fullscreen-mode");
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (clockTimerRef.current) {
        clearInterval(clockTimerRef.current);
      }
    };
  }, []);

  // Lấy ảnh hiện tại để hiển thị
  const getCurrentImage = () => {
    if (!useScheduling) {
      // Nếu không dùng scheduling, hiển thị ảnh từ group hiện tại
      const currentGroup = groups[currentGroupIndex];
      return currentGroup?.images[currentImageIndex];
    }

    // Nếu dùng scheduling và có ảnh active
    if (allActiveImages.length > 0) {
      return allActiveImages[currentImageIndex % allActiveImages.length];
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Storage Error Alert */}
      {storageError && <StorageErrorAlert storageError={storageError} />}

      {/* Current Time and Scheduling Status */}
      <CurrentTimeAndScheduling
        useScheduling={useScheduling}
        setUseScheduling={setUseScheduling}
        currentTime={currentTime}
      />

      {/* Active Group Alert */}
      {useScheduling && (
        <ActiveGroupAlert
          activeScheduledGroup={activeScheduledGroup}
          groups={groups}
        />
      )}

      {/* Slideshow Display */}
      <SlideshowDisplay
        groups={groups}
        currentGroupIndex={currentGroupIndex}
        slideshowContainerRef={slideshowContainerRef}
        nextImage={nextImage}
        currentImageIndex={currentImageIndex}
        isFullscreen={isFullscreen}
        exitFullscreen={exitFullscreen}
        setIsFullscreen={setIsFullscreen}
        useScheduling={useScheduling}
        activeScheduledGroup={activeScheduledGroup}
        setCurrentGroupIndex={setCurrentGroupIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        getCurrentImage={getCurrentImage}
      />

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        groups={groups}
        useScheduling={useScheduling}
        activeScheduledGroup={activeScheduledGroup}
        setCurrentGroupIndex={setCurrentGroupIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        setIsPlaying={setIsPlaying}
        currentGroupIndex={currentGroupIndex}
        currentImageIndex={currentImageIndex}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Storage Controls */}
      <StorageControls
        groups={groups}
        useScheduling={useScheduling}
        setGroups={setGroups}
        setCurrentGroupIndex={setCurrentGroupIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        setIsPlaying={setIsPlaying}
        setUseScheduling={setUseScheduling}
      />

      {/* Group Management */}
      <GroupManagement
        groups={groups}
        activeScheduledGroup={activeScheduledGroup}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        isLoading={isLoading}
        useScheduling={useScheduling}
        fileInputRef={fileInputRef}
        setGroups={setGroups}
        setCurrentGroupIndex={setCurrentGroupIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        currentGroupIndex={currentGroupIndex}
        speed={speed}
        setSpeed={setSpeed}
        timeUnit={timeUnit}
        setTimeUnit={setTimeUnit}
      />
    </div>
  );
}
