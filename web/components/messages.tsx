import { IconPaperclip } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export function Messages() {
  const messages = [
    {
      id: 1,
      author: {
        name: "John Doe",
        role: "supplier",
      },
      content: "Hello, how are you?",
      timestamp: new Date(),
      files: [],
      visuals: [],
      links: [],
    },
    {
      id: 2,
      author: {
        name: "Jane Doe",
        role: "admin",
      },
      content: "I'm good, thank you!",
      timestamp: new Date(),
      files: [],
      visuals: [],
      links: [],
    },
  ];

  return (
    <div className="mb-auto flex-1 space-y-6">
      {messages.map(({ author, content, timestamp, files, visuals, links }) => (
        <>
          <Card
            className={`overflow-hidden rounded-md border-[2px] shadow-lg ${
              author.role === "supplier"
                ? "ml-12 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30"
                : "mr-12 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
            }`}
          >
            <div
              className={`h-1.5 w-full ${author.role === "supplier" ? "bg-green-500" : "bg-blue-500"}`}
            ></div>

            <div className="flex items-start">
              {/* Mesaj içeriği */}
              <div className="flex-1">
                <CardHeader className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {author.name}
                      <span
                        className={`ml-2 rounded px-1.5 py-0.5 text-xs ${
                          author.role === "supplier"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {author.role === "supplier" ? "Supplier" : "Admin"}
                      </span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {timestamp.toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-2 py-2">
                  <p className="whitespace-pre-line text-sm">{content}</p>

                  {/* Ekler gösterimi */}
                  {(files && files.length > 0) ||
                  (visuals && visuals.length > 0) ||
                  (links && links.length > 0) ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {files && files.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 border-primary/20 bg-primary/5 py-0 pl-2 pr-3 hover:bg-primary/10"
                        >
                          <div className="flex items-center">
                            <IconPaperclip className="mr-1 h-3 w-3 text-primary" />
                            <span className="mr-1 text-xs font-medium">
                              Dosyalar
                            </span>
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                              {files.length}
                            </div>
                          </div>
                        </Button>
                      )}

                      {visuals && visuals.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 border-green-500/20 bg-green-500/5 py-0 pl-2 pr-3 hover:bg-green-500/10"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1 text-green-500"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                              />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                            <span className="mr-1 text-xs font-medium">
                              Görseller
                            </span>
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/10 text-xs font-medium text-green-500">
                              {visuals.length}
                            </div>
                          </div>
                        </Button>
                      )}

                      {links && links.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 border-blue-500/20 bg-blue-500/5 py-0 pl-2 pr-3 hover:bg-blue-500/10"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1 text-blue-500"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <span className="mr-1 text-xs font-medium">
                              Bağlantılar
                            </span>
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10 text-xs font-medium text-blue-500">
                              {links.length}
                            </div>
                          </div>
                        </Button>
                      )}
                    </div>
                  ) : null}

                  {/* Görsel önizleme */}
                  {visuals && visuals.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {visuals.map((visual, index) => (
                        <a
                          key={index}
                          href={visual}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={visual}
                            alt={`Görsel ${index + 1}`}
                            className="h-auto max-h-48 w-full rounded border object-cover transition-colors hover:border-primary"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        </>
      ))}
    </div>
  );
}
