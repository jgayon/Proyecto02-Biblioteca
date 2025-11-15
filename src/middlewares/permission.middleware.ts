import { Request, Response, NextFunction } from "express";

export default function permissionMiddleware(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: any = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Debe iniciar sesión" });
    }

    if (!user.permissions || !user.permissions[requiredPermission]) {
      return res.status(403).json({ error: "No tiene permisos suficientes" });
    }

    next();
  };
}
