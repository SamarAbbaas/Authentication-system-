// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { ArrowRight, CheckCircle2, UploadCloud, UserCircle2, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";

// import { Button } from "@/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { supabase } from "@/lib/supabase";

// // Get bucket name from environment variable
// const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || "image2";
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// const uploadAvatar = async (file: File, userId: string) => {
// 	// Generate unique filename with timestamp
// 	const fileName = `${userId}/${Date.now()}_${file.name}`;

// 	const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
// 		upsert: false, // Changed to false to prevent overwrites
// 		contentType: file.type || "image/jpeg",
// 	});

// 	if (error) throw error;
// 	return data;
// };

// export default function UploadPage() {
// 	const router = useRouter();
// 	const [userId, setUserId] = useState<string | null>(null);
// 	const [email, setEmail] = useState<string | null>(null);
// 	const [file, setFile] = useState<File | null>(null);
// 	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// 	const [uploading, setUploading] = useState(false);
// 	const [uploadedPath, setUploadedPath] = useState<string | null>(null);
// 	const [error, setError] = useState<string | null>(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		const loadSession = async () => {
// 			try {
// 				const {
// 					data: { session },
// 				} = await supabase.auth.getSession();

// 				if (!session) {
// 					router.push("/signin");
// 					return;
// 				}

// 				setUserId(session.user.id);
// 				setEmail(session.user.email ?? null);
// 			} catch (err) {
// 				console.error("Session error:", err);
// 				toast.error("Failed to load session");
// 				router.push("/signin");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		loadSession();
// 	}, [router]);

// 	useEffect(() => {
// 		return () => {
// 			if (previewUrl) {
// 				URL.revokeObjectURL(previewUrl);
// 			}
// 		};
// 	}, [previewUrl]);

// 	const selectedFileLabel = useMemo(() => {
// 		if (!file) return "No file selected";
// 		return `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
// 	}, [file]);

// 	const validateFile = (file: File): string | null => {
// 		if (!file.type.startsWith("image/")) {
// 			return "Only image files are allowed";
// 		}
// 		if (file.size > MAX_FILE_SIZE) {
// 			return `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)} MB)`;
// 		}
// 		return null;
// 	};

// 	const handleFileChange = (selectedFile: File | null) => {
// 		setError(null);
// 		setUploadedPath(null);

// 		if (previewUrl) {
// 			URL.revokeObjectURL(previewUrl);
// 		}

// 		if (selectedFile) {
// 			const validationError = validateFile(selectedFile);
// 			if (validationError) {
// 				setError(validationError);
// 				toast.error(validationError);
// 				return;
// 			}
// 		}

// 		setFile(selectedFile);
// 		setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
// 	};

// 	const handleClearSelection = () => {
// 		if (previewUrl) {
// 			URL.revokeObjectURL(previewUrl);
// 		}

// 		setFile(null);
// 		setPreviewUrl(null);
// 		setUploadedPath(null);
// 		setError(null);
// 	};

// 	const handleUpload = async () => {
// 		if (!userId) {
// 			toast.error("Please sign in first.");
// 			return;
// 		}

// 		if (!file) {
// 			toast.error("Choose an image before uploading.");
// 			return;
// 		}

// 		try {
// 			setUploading(true);
// 			setError(null);
// 			const result = await uploadAvatar(file, userId);
// 			setUploadedPath(result.path);
// 			toast.success("Avatar uploaded successfully!");
// 			// Clear file after successful upload
// 			handleClearSelection();
// 		} catch (err) {
// 			const message = err instanceof Error ? err.message : "Upload failed.";
// 			setError(message);
// 			toast.error(message);
// 		} finally {
// 			setUploading(false);
// 		}
// 	};

// 	if (isLoading) {
// 		return (
// 			<div className="min-h-screen flex items-center justify-center bg-white bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(245,247,250,0.96)_35%,rgba(230,236,244,0.92)_100%)]">
// 				<p className="text-muted-foreground">Loading...</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="min-h-screen bg-white bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(245,247,250,0.96)_35%,rgba(230,236,244,0.92)_100%)] px-4 py-10 text-foreground sm:px-6 lg:px-8">
// 			<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
// 				<div className="flex items-center justify-between gap-3 rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur">
// 					<div>
// 						<p className="text-sm text-muted-foreground">Profile media</p>
// 						<h1 className="text-2xl font-semibold tracking-tight">Upload your avatar</h1>
// 					</div>
// 					<Button variant="outline" onClick={() => router.push("/dashboard")}>
// 						<ArrowRight className="mr-2 size-4" />
// 						Back to dashboard
// 					</Button>
// 				</div>

// 				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
// 					<Card className="border-border/70 bg-background/90 shadow-lg shadow-black/5">
// 						<CardHeader className="border-b border-border/60">
// 							<CardTitle>Upload a new avatar</CardTitle>
// 							<CardDescription>
// 								Pick an image and upload it to your profile. Max file size: 5MB
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="space-y-5 pt-6">
// 							<div className="grid gap-2">
// 								<label className="text-sm font-medium" htmlFor="avatar-file">
// 									Choose image
// 								</label>
// 								<Input
// 									id="avatar-file"
// 									type="file"
// 									accept="image/*"
// 									onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
// 									className="h-auto py-2 file:mr-4 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-sm file:font-medium file:text-background"
// 									disabled={uploading}
// 								/>
// 								<p className="text-sm text-muted-foreground">{selectedFileLabel}</p>
// 							</div>

// 							{error && (
// 								<div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// 									<AlertCircle className="size-4" />
// 									{error}
// 								</div>
// 							)}

// 							<div className="flex flex-wrap gap-3">
// 								<Button onClick={handleUpload} disabled={uploading || !file || !userId}>
// 									{uploading ? (
// 										<>
// 											<UploadCloud className="mr-2 size-4 animate-pulse" />
// 											Uploading...
// 										</>
// 									) : (
// 										<>
// 											<UploadCloud className="mr-1 size-4" />
// 											Upload avatar
// 										</>
// 									)}
// 								</Button>

// 								<Button variant="outline" onClick={handleClearSelection} disabled={uploading || !file}>
// 									Clear selection
// 								</Button>
// 							</div>

// 							{uploadedPath ? (
// 								<div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
// 									<CheckCircle2 className="size-4" />
// 									Uploaded: {uploadedPath}
// 								</div>
// 							) : null}
// 						</CardContent>
// 					</Card>

// 					<Card className="border-border/70 bg-background/90 shadow-lg shadow-black/5">
// 						<CardHeader className="border-b border-border/60">
// 							<CardTitle>Preview</CardTitle>
// 							<CardDescription>
// 								See the selected file before uploading.
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent className="flex min-h-90 flex-col items-center justify-center gap-4 pt-6">
// 							{previewUrl ? (
// 								<Image
// 									src={previewUrl}
// 									alt="Selected avatar preview"
// 									width={224}
// 									height={224}
// 									unoptimized
// 									className="aspect-square w-56 rounded-3xl border object-cover shadow-md"
// 								/>
// 							) : (
// 								<div className="flex aspect-square w-56 items-center justify-center rounded-3xl border border-dashed bg-muted/40 text-muted-foreground">
// 									<div className="text-center">
// 										<UserCircle2 className="mx-auto mb-3 size-14" />
// 										<p>No image selected</p>
// 									</div>
// 								</div>
// 							)}

// 							<div className="max-w-sm text-center text-sm text-muted-foreground">
// 								Signed in as <span className="font-medium text-foreground">{email ?? "unknown user"}</span>. Your upload is tied to your account.
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  UserCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

// Aapka bucket name yahan set kar diya hai
const BUCKET_NAME = "Samar Abbas";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. READ: Existing Avatar Check aur Session Load karna
  useEffect(() => {
    const loadSessionAndAvatar = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/signin");
          return;
        }

        const uId = session.user.id;
        setUserId(uId);
        setEmail(session.user.email ?? null);

        // Check agar pehle se koi avatar maujood hai
        await fetchCurrentAvatar(uId);
      } catch (err) {
        console.error("Session error:", err);
        toast.error("Failed to load session");
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionAndAvatar();
  }, [router]);

  // Clean up dynamic preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Current avatar fetch karne ka function
  const fetchCurrentAvatar = async (uId: string) => {
    try {
      // Folder check karne ke liye files list karenge
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(uId);

      if (error) throw error;

      // Agar folder me avatar file maujood hai
      if (data && data.length > 0) {
        const avatarFile = data.find((f) => f.name.startsWith("avatar"));
        if (avatarFile) {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${uId}/${avatarFile.name}`);

          // Cache busting ke liye timestamp add kiya hai ताकि updated image फौरन दिखे
          setCurrentAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`);
        } else {
          setCurrentAvatarUrl(null);
        }
      } else {
        setCurrentAvatarUrl(null);
      }
    } catch (err) {
      console.error("Error fetching avatar:", err);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 5MB`;
    }
    return null;
  };

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // 2. CREATE / UPDATE: Upload & Replace operations
  const handleUpload = async () => {
    if (!userId || !file) return;

    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // upsert: true lagaya hai taake agar pehle se file ho to wo UPDATE ho jaye (CRUD Ka U)
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      toast.success(
        currentAvatarUrl
          ? "Avatar updated successfully!"
          : "Avatar uploaded successfully!",
      );

      // File fields reset karke fresh avatar load karna
      setFile(null);
      setPreviewUrl(null);
      await fetchCurrentAvatar(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  // 3. DELETE: Avatar delete karne ka operation
  const handleDelete = async () => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      "Kya aap waqai apna avatar delete karna chahte hain?",
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);

      // Pehle list karke extension check karenge taake sahi file delete ho
      const { data } = await supabase.storage.from(BUCKET_NAME).list(userId);
      const avatarFile = data?.find((f) => f.name.startsWith("avatar"));

      if (!avatarFile) {
        toast.error("No avatar found to delete.");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([`${userId}/${avatarFile.name}`]);

      if (deleteError) throw deleteError;

      setCurrentAvatarUrl(null);
      toast.success("Avatar deleted successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="saas-bg min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading secure session...
        </p>
      </div>
    );
  }

  return (
    <div className="saas-bg min-h-screen px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-4 shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Profile Settings</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Manage Profile
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowRight className="mr-2 size-4" />
            Dashboard
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Side: Upload Controls */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {currentAvatarUrl ? "Update Profile" : "Upload Profile"}
              </CardTitle>
              <CardDescription>
                Select new Profile ...max size is 5MB..
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                  disabled={uploading || deleting}
                  className="h-auto py-2 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white cursor-pointer"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="size-4" />
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !file || deleting}
                >
                  <UploadCloud className="mr-2 size-4" />
                  {uploading
                    ? "Saving..."
                    : currentAvatarUrl
                      ? "Update Image"
                      : "Upload New"}
                </Button>

                {currentAvatarUrl && (
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={uploading || deleting}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {deleting ? "Deleting..." : "Delete Avatar"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Live CRUD Preview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Profile Live Status</CardTitle>
              <CardDescription>
              Your  selected preview media.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-65 flex-col items-center justify-center gap-4">
              {/* Pehle priority Preview ko milegi, phir Active Avatar ko, warna Fallback placeholder */}
              {previewUrl ? (
                <div className="text-center">
                  <Image
                    src={previewUrl}
                    alt="New preview"
                    width={160}
                    height={160}
                    unoptimized
                    className="aspect-square w-40 rounded-full border-4 border-blue-500 object-cover shadow"
                  />
                  <p className="text-xs text-blue-600 font-medium mt-2">
                    New Selection (Unsaved)
                  </p>
                </div>
              ) : currentAvatarUrl ? (
                <div className="text-center">
                  <Image
                    src={currentAvatarUrl}
                    alt="Current active avatar"
                    width={160}
                    height={160}
                    unoptimized
                    className="aspect-square w-40 rounded-full border-4 border-emerald-500 object-cover shadow"
                  />
                  <p className="text-xs text-emerald-600 font-medium mt-2">
                    Active Live Profile
                  </p>
                </div>
              ) : (
                <div className="flex aspect-square w-40 items-center justify-center rounded-full border-2 border-dashed bg-muted text-muted-foreground">
                  <div className="text-center">
                    <UserCircle2 className="mx-auto size-12 opacity-40" />
                    <p className="text-xs mt-1">No Profile Pic</p>
                  </div>
                </div>
              )}

              <div className="text-center text-xs text-muted-foreground mt-4 border-t pt-4 w-full">
                Signed in:{" "}
                <span className="font-semibold text-foreground">{email}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
