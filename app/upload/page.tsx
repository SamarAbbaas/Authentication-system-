"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, UploadCloud, UserCircle2 } from "lucide-react";
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

const bucketName = "image2";

const uploadAvatar = async (file: File, userId: string) => {
	const fileName = `${userId}/avatar.jpg`;

	const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
		upsert: true,
		contentType: file.type || "image/jpeg",
	});

	if (error) throw error;
	return data;
};

export default function UploadPage() {
	const router = useRouter();
	const [userId, setUserId] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedPath, setUploadedPath] = useState<string | null>(null);

	useEffect(() => {
		const loadSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				router.push("/signin");
				return;
			}

			setUserId(session.user.id);
			setEmail(session.user.email ?? null);
		};

		loadSession();
	}, [router]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const selectedFileLabel = useMemo(() => {
		if (!file) return "No file selected";
		return `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
	}, [file]);

	const handleFileChange = (selectedFile: File | null) => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		setFile(selectedFile);
		setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
		setUploadedPath(null);
	};

	const handleClearSelection = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		setFile(null);
		setPreviewUrl(null);
		setUploadedPath(null);
	};

	const handleUpload = async () => {
		if (!userId) {
			toast.error("Please sign in first.");
			return;
		}

		if (!file) {
			toast.error("Choose an image before uploading.");
			return;
		}

		if (!file.type.startsWith("image/")) {
			toast.error("Only image files are allowed.");
			return;
		}

		try {
			setUploading(true);
			const result = await uploadAvatar(file, userId);
			setUploadedPath(result.path);
			toast.success("Avatar uploaded successfully.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Upload failed.";
			toast.error(message);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="min-h-screen  bg-white bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(245,247,250,0.96)_35%,rgba(230,236,244,0.92)_100%)] px-4 py-10 text-foreground sm:px-6 lg:px-8">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
				<div className="flex items-center justify-between gap-3 rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur">
					<div>
						<p className="text-sm text-muted-foreground">Profile media</p>
						<h1 className="text-2xl font-semibold tracking-tight">Upload your avatar</h1>
					</div>
					<Button variant="outline" onClick={() => router.push("/dashboard")}>
						<ArrowRight className="mr-2 size-4" />
						Back to dashboard
					</Button>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<Card className="border-border/70 bg-background/90 shadow-lg shadow-black/5">
						<CardHeader className="border-b border-border/60">
							<CardTitle>Upload a new avatar</CardTitle>
							<CardDescription>
								Pick an image and replace the current avatar stored in the Supabase bucket.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5 pt-6">
							<div className="grid gap-2">
								<label className="text-sm font-medium" htmlFor="avatar-file">
									Choose image
								</label>
								<Input
									id="avatar-file"
									type="file"
									accept="image/*"
									onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
									className="h-auto py-2 file:mr-4 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-sm file:font-medium file:text-background"
								/>
								<p className="text-sm text-muted-foreground">{selectedFileLabel}</p>
							</div>

							<div className="flex flex-wrap gap-3">
								<Button onClick={handleUpload} disabled={uploading || !file || !userId}>
									{uploading ? (
										<>
											<UploadCloud className="mr-2 size-4 animate-pulse" />
											Uploading...
										</>
									) : (
										<>
											<UploadCloud className="mr-1 size-4" />
											Upload avatar
										</>
									)}
								</Button>

								<Button variant="outline" onClick={handleClearSelection} disabled={uploading || !file}>
									Clear selection
								</Button>
							</div>

							{/* <div className="rounded-xl border border-dashed border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
								The avatar is stored as <span className="font-medium text-foreground">{bucketName}/{"<user-id>"}/avatar.jpg</span> so each user replaces their own file.
							</div> */}

							{uploadedPath ? (
								<div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
									<CheckCircle2 className="size-4" />
									Uploaded: {uploadedPath}
								</div>
							) : null}
						</CardContent>
					</Card>

					<Card className="border-border/70 bg-background/90 shadow-lg shadow-black/5">
						<CardHeader className="border-b border-border/60">
							<CardTitle>Preview</CardTitle>
							<CardDescription>
								See the selected file before sending it to Supabase.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex min-h-90 flex-col items-center justify-center gap-4 pt-6">
							{previewUrl ? (
								<Image
									src={previewUrl}
									alt="Selected avatar preview"
									width={224}
									height={224}
									unoptimized
									className="aspect-square w-56 rounded-3xl border object-cover shadow-md"
								/>
							) : (
								<div className="flex aspect-square w-56 items-center justify-center rounded-3xl border border-dashed bg-muted/40 text-muted-foreground">
									<div className="text-center">
										<UserCircle2 className="mx-auto mb-3 size-14" />
										<p>No image selected</p>
									</div>
								</div>
							)}

							<div className="max-w-sm text-center text-sm text-muted-foreground">
								Signed in as {email ?? "unknown user"}. The upload button uses your session user id, so the file is tied to your account.
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
