"""Compatibility alias: ``claude_spine`` is now ``art_pipeline``.

Old imports (``import claude_spine.mesh``, ``from claude_spine.server import mcp``)
keep working and resolve to the very same module objects.
"""
import importlib
import importlib.abc
import importlib.util
import sys

import art_pipeline as _real
from art_pipeline import *  # noqa: F401,F403

_OLD, _NEW = "claude_spine", "art_pipeline"


class _Alias(importlib.abc.Loader):
    def __init__(self, target: str):
        self.target = target

    def create_module(self, spec):
        return importlib.import_module(self.target)

    def exec_module(self, module):  # already executed under its real name
        pass


class _Finder(importlib.abc.MetaPathFinder):
    def find_spec(self, name, path=None, target=None):
        if name.startswith(_OLD + "."):
            real = _NEW + name[len(_OLD):]
            try:
                if importlib.util.find_spec(real) is None:
                    return None
            except (ImportError, ValueError):
                return None
            return importlib.util.spec_from_loader(name, _Alias(real))
        return None


if not any(isinstance(f, _Finder) for f in sys.meta_path):
    sys.meta_path.insert(0, _Finder())
